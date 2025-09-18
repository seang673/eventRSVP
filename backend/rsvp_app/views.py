from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, generics
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser
from .models import Event, RSVP, CustomUser
from .serializers import EventSerializer, RSVPSerializer, RegisterSerializer
# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    authentication_classes = [SessionAuthentication]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'location', 'description']

class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAdminUser] #Only authenticated users (with tokens) can access
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['name', 'confirmed']
    ordering=['-confirmed']
    search_fields = ['name', 'email', 'message']
    filterset_fields = ['confirmed', 'event']

