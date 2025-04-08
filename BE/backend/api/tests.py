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
