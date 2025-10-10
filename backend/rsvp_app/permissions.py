from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOrganizer(BasePermission):
    """
    Custom permission to allow only users with is_organizer=True.
    """

    message = "You must be an organizer to perform this action."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_organizer

class IsAttendee(BasePermission):
    message = "Only attendees can perform this action"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and not request.user.is_organizer
