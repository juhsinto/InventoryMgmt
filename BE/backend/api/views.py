from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from datetime import datetime
from .models import User, Category, InventoryItem, ItemChange
from .serializers import UserSerializer, CategorySerializer, InventoryItemSerializer, ItemChangeSerializer
from .permissions import IsAdminOrSelf, IsAdminOrManagerCanUpdateInventory

def RootIndex(request):
    now = datetime.now()
    html = '<html lang="en"><body>This is the default view. The UTC time is %s.</body></html>' % now
    return HttpResponse(html)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """
        Custom permissions:
        - Admin can do anything
        - Regular users can only view their own profile
        """
        if self.action == 'create':
            permission_classes = []
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filter queryset based on user role:
        - Admins see all users
        - Managers & Regular users see only themselves
        """
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Only admins can manage categories

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsAdminOrManagerCanUpdateInventory()]
        elif self.action == 'history':
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return super().get_permissions()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Check if a manager is making the update and if quantity or low_stock are being changed
        user = request.user
        if user.role == 'manager' or user.role == 'admin':
            quantity_before = instance.quantity
            low_stock_before = instance.low_stock

            self.perform_update(serializer)

            quantity_after = instance.quantity
            low_stock_after = instance.low_stock

            if quantity_before != quantity_after or low_stock_before != low_stock_after:
                ItemChange.objects.create(
                    inventory_item=instance,
                    user=user,
                    quantity_before=quantity_before if quantity_before != quantity_after else None,
                    quantity_after=quantity_after if quantity_before != quantity_after else None,
                    low_stock_before=low_stock_before if low_stock_before != low_stock_after else None,
                    low_stock_after=low_stock_after if low_stock_before != low_stock_after else None,
                )
            return Response(serializer.data)
        else:
            self.perform_update(serializer)
            return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Retrieves the history of changes for a specific inventory item.
        """
        try:
            item = self.get_object()
        except InventoryItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=404)

        item_changes = ItemChange.objects.filter(inventory_item=item).order_by('-timestamp')
        serializer = ItemChangeSerializer(item_changes, many=True)
        
        return Response(serializer.data)