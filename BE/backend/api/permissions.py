# permissions.py
from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    """
    Permission to only allow:
    - admins can any user
    - managers & users can edit themselves
    """
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Admin can do anything
        if user.role == 'admin':
            return True
        
        # Users can edit themselves
        return obj.id == user.id