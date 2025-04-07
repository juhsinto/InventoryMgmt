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

class IsAdminOrManagerCanUpdateInventory(permissions.BasePermission):
    """
    Permission to allow admins and managers to update quantity and low_stock.
    Admins can update all fields.
    Managers can only update 'quantity' and 'low_stock' fields.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == 'admin':
            return True

        if user.role == 'manager' and request.method in ['PUT', 'PATCH']:
            allowed_fields = ['quantity', 'low_stock']
            for field in request.data:
                if field not in allowed_fields:
                    return False
            return True

        return False        