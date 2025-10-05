from django.shortcuts import render
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import PermissionDenied, ValidationError
from rest_framework import viewsets, filters, generics, status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated, BasePermission
from rest_framework.response import Response
from .models import Event, RSVP, CustomUser
from .serializers import EventSerializer, RSVPSerializer, RegisterSerializer
from .permissions import IsOrganizer, IsAttendee
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    authentication_classes = [SessionAuthentication]

class CustomLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_organizer': user.is_organizer
                }
            })
        return Response({'error': 'Invalid credentils'}, status=status.HTTP_401_UNAUTHORIZED)

class CreateEventView(generics.CreateAPIView):
    permission_classes = [IsOrganizer]
    serializer_class = EventSerializer

class RSVPView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RSVPSerializer

class DashboardView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "is_organizer" :user.is_organizer,
            "message": "Welcome to the dashboard!"
        })
class OrganizerRSVPListView(ListAPIView):
    serializer_clas = RSVPSerializer
    permission_classes = [IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return RSVP.objects.filter(event__organizer=self.request.user)

class OrganizerEventListView(ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'location', 'description']
    ordering_fields = ['date', 'title', 'location']
    filterset_fields = ['date', 'location']
    permission_classes = [IsAuthenticated, IsOrganizer, IsAttendee]

    ordering = ['date']

    def get_queryset(self):
        user = self.request.user

        logger.debug(f"User {user.username} is_organizer={user.is_organizer}")

        if not user.is_authenticated:
            return Event.objects.none()

        if user.is_organizer:
            #Organizers will only see their own events
            return Event.objects.filter(organizer=user)
        return Event.objects.all()


    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated, IsOrganizer, IsAttendee] #Only admin users (with tokens) can access
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['name', 'confirmed']
    ordering=['-confirmed']
    search_fields = ['name', 'email', 'message']
    filterset_fields = ['confirmed', 'event']

    def get_queryset(self):
        user = self.request.user

        if user.is_organizer:
            #Organizers will only see RSVPs for their own events
            return RSVP.objects.filter(event__organizer=user)

        #Attendees will only see their own RSVPs
        return RSVP.objects.filter(email=user.email)

    def perform_destroy(self, instance):
        instance.delete()

    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.validated_data['event']
        current_rsvp_count = RSVP.objects.filter(event=event).count()

        if current_rsvp_count >= event.capacity:
            raise ValidationError("This event has reached its RSVP limit.")

        if user.is_organizer:
            raise PermissionDenied("Organizers cannot RSVP to events.")
        serializer.save()





