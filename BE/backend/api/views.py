from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
#from rest_framework.permissions import AllowAny
from datetime import datetime
from .models import User, Category, InventoryItem
from .serializers import UserSerializer, CategorySerializer, InventoryItemSerializer
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

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsAdminOrManagerCanUpdateInventory()]
        return [permissions.IsAuthenticated()] 