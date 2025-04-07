from django.contrib import admin
from django.urls import path, include
from api.views import UserViewSet, CategoryViewSet, InventoryItemViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('categories', CategoryViewSet)
router.register('items', InventoryItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.RootIndex, name='index'),
    path('api/', include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]