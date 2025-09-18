from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAdminUser
from .models import Event, RSVP
from .serializers import EventSerializer, RSVPSerializer
# Create your views here.

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

