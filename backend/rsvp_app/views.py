from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import PermissionDenied
from rest_framework import viewsets, filters, generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated, BasePermission
from rest_framework.response import Response
from .models import Event, RSVP, CustomUser
from .serializers import EventSerializer, RSVPSerializer, RegisterSerializer
# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    authentication_classes = [SessionAuthentication]

class IsOrganizer(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_organizer

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

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'location', 'description']
    filterset_fields = ['date', 'location']

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAdminUser] #Only admin users (with tokens) can access
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['name', 'confirmed']
    ordering=['-confirmed']
    search_fields = ['name', 'email', 'message']
    filterset_fields = ['confirmed', 'event']

