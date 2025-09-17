from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import EventViewSet, RSVPViewSet

router = DefaultRouter()   #Atuo Generates routes
router.register(r'events', EventViewSet)
router.register(r'rsvps', RSVPViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]