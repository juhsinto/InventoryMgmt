from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from .models import Category, InventoryItem, ItemChange
from .permissions import IsAdminOrSelf, IsAdminOrManagerCanUpdateInventory

class UserModelTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        
    def test_create_user(self):
        user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertEqual(user.role, 'user')
        
    def test_create_superuser(self):
        admin = self.User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, 'admin')
        
    def test_user_str_representation(self):
        user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
        self.assertEqual(str(user), 'testuser - user')
        
    def test_user_creation_without_email(self):
        with self.assertRaises(ValueError):
            self.User.objects.create_user(username='testuser', email='')

class CategoryModelTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        
    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Test Category')
        self.assertEqual(self.category.description, 'Test Description')
        
    def test_category_str_representation(self):
        self.assertEqual(str(self.category), 'Test Category')
        
    def test_category_unique_name(self):
        with self.assertRaises(Exception):
            Category.objects.create(name='Test Category')

class InventoryItemModelTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
        self.category = Category.objects.create(
            name='Test Category'
        )
        self.item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        
    def test_item_creation(self):
        self.assertEqual(self.item.sku, 'TEST123')
        self.assertEqual(self.item.name, 'Test Item')
        self.assertEqual(self.item.quantity, 10)
        self.assertEqual(self.item.price, Decimal('99.99'))
        self.assertFalse(self.item.low_stock)
        
    def test_item_str_representation(self):
        self.assertEqual(str(self.item), 'Test Item')
        
    def test_sku_uniqueness(self):
        with self.assertRaises(Exception):
            InventoryItem.objects.create(
                sku='TEST123',
                name='Another Item',
                quantity=5,
                price=Decimal('49.99'),
                category=self.category,
                created_by=self.user
            )

class ItemChangeModelTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
        self.category = Category.objects.create(name='Test Category')
        self.item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        self.change = ItemChange.objects.create(
            inventory_item=self.item,
            user=self.user,
            quantity_before=10,
            quantity_after=5,
            low_stock_before=False,
            low_stock_after=True
        )
        
    def test_change_creation(self):
        self.assertEqual(self.change.quantity_before, 10)
        self.assertEqual(self.change.quantity_after, 5)
        self.assertFalse(self.change.low_stock_before)
        self.assertTrue(self.change.low_stock_after)
        
    def test_change_str_representation(self):
        expected_str = f"{self.change.timestamp} - {self.item.name} - {self.user}"
        self.assertEqual(str(self.change), expected_str)

class UserViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.admin = self.User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='test123'
        )
        
    def test_user_registration(self):
        response = self.client.post('/api/users/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.User.objects.count(), 3)
        
    def test_user_profile_retrieval(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/users/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        
    def test_admin_access_all_profiles(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_regular_user_restricted_access(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class CategoryViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.admin = self.User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='test123'
        )
        
    def test_category_creation_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/categories/', {
            'name': 'New Category',
            'description': 'New Description'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        
    def test_category_creation_unauthorized(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/categories/', {
            'name': 'New Category',
            'description': 'New Description'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class InventoryItemViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.admin = self.User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.manager = self.User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='test123'
        )
        self.category = Category.objects.create(name='Test Category')
        
    def test_item_creation(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/items/', {
            'sku': 'TEST123',
            'name': 'Test Item',
            'quantity': 10,
            'price': '99.99',
            'category': self.category.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(InventoryItem.objects.count(), 1)
        
    def test_item_update_by_manager(self):
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(f'/api/items/{item.id}/', {
            'quantity': 5
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ItemChange.objects.count(), 1)
        
    def test_item_update_by_regular_user(self):
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/items/{item.id}/', {
            'quantity': 5
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_history_endpoint(self):
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(f'/api/items/{item.id}/history/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_history_endpoint_unauthorized(self):
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/items/{item.id}/history/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class PermissionTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.admin = self.User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
        self.manager = self.User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.user = self.User.objects.create_user(
            username='user',
            email='user@example.com',
            password='user123',
            role='user'
        )
        
    def test_is_admin_or_self_permission_admin(self):
        permission = IsAdminOrSelf()
        request = type('Request', (), {'user': self.admin})()
        self.assertTrue(permission.has_object_permission(request, None, self.user))
        
    def test_is_admin_or_self_permission_self(self):
        permission = IsAdminOrSelf()
        request = type('Request', (), {'user': self.user})()
        self.assertTrue(permission.has_object_permission(request, None, self.user))
        
    def test_is_admin_or_self_permission_other(self):
        permission = IsAdminOrSelf()
        request = type('Request', (), {'user': self.user})()
        self.assertFalse(permission.has_object_permission(request, None, self.manager))
        
    def test_is_admin_or_manager_can_update_inventory_admin(self):
        permission = IsAdminOrManagerCanUpdateInventory()
        request = type('Request', (), {
            'user': self.admin,
            'method': 'PATCH',
            'data': {'quantity': 5, 'name': 'New Name'}
        })()
        self.assertTrue(permission.has_object_permission(request, None, None))
        
    def test_is_admin_or_manager_can_update_inventory_manager_allowed(self):
        permission = IsAdminOrManagerCanUpdateInventory()
        request = type('Request', (), {
            'user': self.manager,
            'method': 'PATCH',
            'data': {'quantity': 5, 'low_stock': True}
        })()
        self.assertTrue(permission.has_object_permission(request, None, None))
        
    def test_is_admin_or_manager_can_update_inventory_manager_not_allowed(self):
        permission = IsAdminOrManagerCanUpdateInventory()
        request = type('Request', (), {
            'user': self.manager,
            'method': 'PATCH',
            'data': {'name': 'New Name'}
        })()
        self.assertFalse(permission.has_object_permission(request, None, None))
        
    def test_is_admin_or_manager_can_update_inventory_regular_user(self):
        permission = IsAdminOrManagerCanUpdateInventory()
        request = type('Request', (), {
            'user': self.user,
            'method': 'PATCH',
            'data': {'quantity': 5}
        })()
        self.assertFalse(permission.has_object_permission(request, None, None))

class TokenSerializerTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='test123',
            role='user'
        )
        
    def test_custom_token_obtain_pair_serializer(self):
        from .token_serializer import CustomTokenObtainPairSerializer
        serializer = CustomTokenObtainPairSerializer()
        token = serializer.get_token(self.user)
        self.assertEqual(token['role'], 'user')
        
    def test_custom_token_obtain_pair_serializer_admin(self):
        from .token_serializer import CustomTokenObtainPairSerializer
        admin = self.User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
        serializer = CustomTokenObtainPairSerializer()
        token = serializer.get_token(admin)
        self.assertEqual(token['role'], 'admin')

class SerializerTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.admin = self.User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
        self.manager = self.User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.user = self.User.objects.create_user(
            username='user',
            email='user@example.com',
            password='user123',
            role='user'
        )
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        
    def test_user_serializer_create(self):
        from .serializers import UserSerializer
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'role': 'user'
        }
        serializer = UserSerializer(data=data, context={'request': type('Request', (), {'user': self.admin})()})
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, 'newuser')
        self.assertEqual(user.added_by, self.admin)
        
    def test_user_serializer_update(self):
        from .serializers import UserSerializer
        data = {'password': 'newpass123'}
        serializer = UserSerializer(self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertTrue(user.check_password('newpass123'))
        
    def test_user_serializer_validate_role_admin(self):
        from .serializers import UserSerializer
        data = {
            'username': 'newadmin',
            'email': 'newadmin@example.com',
            'password': 'admin123',
            'role': 'admin'
        }
        request = type('Request', (), {'user': self.admin, 'is_authenticated': True})()
        serializer = UserSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid())
        
    def test_user_serializer_validate_role_manager(self):
        from .serializers import UserSerializer
        data = {'role': 'admin'}
        serializer = UserSerializer(data=data, context={'request': type('Request', (), {'user': self.manager})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('role', serializer.errors)
        
    def test_user_serializer_validate_role_user(self):
        from .serializers import UserSerializer
        data = {'role': 'manager'}
        serializer = UserSerializer(data=data, context={'request': type('Request', (), {'user': self.user})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn('role', serializer.errors)
        
    def test_inventory_item_serializer_create(self):
        from .serializers import InventoryItemSerializer
        data = {
            'sku': 'TEST123',
            'name': 'Test Item',
            'quantity': 10,
            'price': '99.99',
            'category': self.category.id
        }
        serializer = InventoryItemSerializer(data=data, context={'request': type('Request', (), {'user': self.user})()})
        self.assertTrue(serializer.is_valid())
        item = serializer.save()
        self.assertEqual(item.sku, 'TEST123')
        self.assertEqual(item.created_by, self.user)
        
    def test_inventory_item_serializer_read_only_fields(self):
        from .serializers import InventoryItemSerializer
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        serializer = InventoryItemSerializer(item)
        data = serializer.data
        self.assertIn('category_name', data)
        self.assertEqual(data['category_name'], self.category.name)
        self.assertEqual(data['created_by'], self.user.id)
        
    def test_item_change_serializer(self):
        from .serializers import ItemChangeSerializer
        item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.user
        )
        change = ItemChange.objects.create(
            inventory_item=item,
            user=self.user,
            quantity_before=10,
            quantity_after=5,
            low_stock_before=False,
            low_stock_after=True
        )
        serializer = ItemChangeSerializer(change)
        data = serializer.data
        self.assertEqual(data['user'], self.user.username)
        self.assertEqual(data['quantity_before'], 10)
        self.assertEqual(data['quantity_after'], 5)
        self.assertFalse(data['low_stock_before'])
        self.assertTrue(data['low_stock_after'])

class RootIndexTests(TestCase):
    def test_root_index(self):
        from .views import RootIndex
        from django.test import RequestFactory
        factory = RequestFactory()
        request = factory.get('/')
        response = RootIndex(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn('UTC time', response.content.decode())

class InventoryItemViewSetAdditionalTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.admin = self.User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
        self.manager = self.User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            role='manager'
        )
        self.category = Category.objects.create(name='Test Category')
        self.item = InventoryItem.objects.create(
            sku='TEST123',
            name='Test Item',
            quantity=10,
            price=Decimal('99.99'),
            category=self.category,
            created_by=self.admin
        )
        
    def test_item_update_by_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f'/api/items/{self.item.id}/', {
            'quantity': 5,
            'name': 'Updated Item'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.name, 'Updated Item')
        self.assertEqual(self.item.quantity, 5)
        
    def test_item_update_by_manager_no_changes(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(f'/api/items/{self.item.id}/', {
            'quantity': 10  # Same as current quantity
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ItemChange.objects.count(), 0)  # No change record should be created
