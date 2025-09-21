from rest_framework.permissions import BasePermission

class IsOrganizer(BasePermission):
    """
    Custom permission to allow only users with is_organizer=True.
    """

    message = "You must be an organizer to perform this action."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_organizer

