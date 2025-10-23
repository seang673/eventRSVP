from django.urls import path, include
from django.contrib.auth.views import LoginView
from rest_framework.routers import DefaultRouter
from .views import CustomLoginView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import EventViewSet, RSVPViewSet, RegisterView, DashboardView, OrganizerRSVPListView, OrganizerEventListView

router = DefaultRouter()   #Auto Generates routes for events and rsvps
router.register(r'events', EventViewSet)
router.register(r'rsvps', RSVPViewSet)

urlpatterns = [
    path('rsvps/organizer/', OrganizerRSVPListView.as_view(), name='organizer-rsvps'),
    path('events/organizer/', OrganizerEventListView.as_view(), name='organizer-events'),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

