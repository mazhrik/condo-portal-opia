from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, datetime, timedelta
from .models import (
    Resident, Staff, Poll, PollOption, PollVote,
    IncidentReport, Event, Package, MaintenanceRequest
)


class AuthenticationTestCase(APITestCase):
    """Test JWT authentication"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.resident = Resident.objects.create(
            user=self.user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
    
    def test_jwt_token_generation(self):
        """Test JWT token can be generated"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.assertIsNotNone(access_token)
    
    def test_authenticated_request(self):
        """Test making authenticated API request"""
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/residents/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN])
    
    def test_unauthenticated_request(self):
        """Test unauthenticated request is rejected"""
        response = self.client.get('/api/residents/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PollViewSetTestCase(APITestCase):
    """Test Poll API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create staff user
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position='Admin',
            department='Management',
            hire_date=date.today()
        )
        
        # Create resident user
        self.resident_user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        
        # Create a poll
        self.poll = Poll.objects.create(
            question='Should we renovate the pool?',
            created_by=self.staff,
            is_active=True
        )
        self.option1 = PollOption.objects.create(poll=self.poll, text='Yes')
        self.option2 = PollOption.objects.create(poll=self.poll, text='No')
    
    def test_list_polls_authenticated(self):
        """Test listing polls as authenticated user"""
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/polls/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_list_polls_unauthenticated(self):
        """Test listing polls without authentication fails"""
        response = self.client.get('/api/polls/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_vote_on_poll(self):
        """Test resident can vote on a poll"""
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.post(
            f'/api/polls/{self.poll.id}/vote/',
            {'option_id': self.option1.id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify vote was recorded
        self.assertTrue(
            PollVote.objects.filter(
                poll=self.poll,
                resident=self.resident,
                option=self.option1
            ).exists()
        )
    
    def test_cannot_vote_twice(self):
        """Test resident cannot vote twice on same poll"""
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # First vote
        self.client.post(
            f'/api/polls/{self.poll.id}/vote/',
            {'option_id': self.option1.id}
        )
        
        # Second vote should fail
        response = self.client.post(
            f'/api/polls/{self.poll.id}/vote/',
            {'option_id': self.option2.id}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class IncidentReportViewSetTestCase(APITestCase):
    """Test IncidentReport API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.resident_user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position='Security',
            department='Operations',
            hire_date=date.today()
        )
    
    def test_create_incident_report(self):
        """Test resident can create incident report"""
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        data = {
            'title': 'Broken Window',
            'description': 'Window in lobby is cracked',
            'location': 'Main Lobby',
            'status': 'open'
        }
        
        response = self.client.post('/api/incidents/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify incident was created
        self.assertTrue(
            IncidentReport.objects.filter(
                resident=self.resident,
                title='Broken Window'
            ).exists()
        )
    
    def test_resident_sees_only_own_incidents(self):
        """Test resident can only see their own incidents"""
        # Create another resident
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        other_resident = Resident.objects.create(
            user=other_user,
            unit_number='102',
            phone_number='555-5678',
            move_in_date=date.today()
        )
        
        # Create incidents for both residents
        IncidentReport.objects.create(
            resident=self.resident,
            title='My Incident',
            description='Test',
            status='open'
        )
        IncidentReport.objects.create(
            resident=other_resident,
            title='Other Incident',
            description='Test',
            status='open'
        )
        
        # Login as first resident
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/incidents/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should only see own incident
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My Incident')


class EventViewSetTestCase(APITestCase):
    """Test Event API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position='Event Coordinator',
            department='Community',
            hire_date=date.today()
        )
        
        self.resident_user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
    
    def test_list_events(self):
        """Test listing events"""
        Event.objects.create(
            title='Summer BBQ',
            description='Annual BBQ',
            date=datetime.now() + timedelta(days=7),
            location='Pool Area',
            created_by=self.staff,
            is_active=True
        )
        
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Summer BBQ')


class PackageViewSetTestCase(APITestCase):
    """Test Package API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.resident_user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position='Front Desk',
            department='Operations',
            hire_date=date.today()
        )
    
    def test_resident_sees_own_packages(self):
        """Test resident can see their own packages"""
        Package.objects.create(
            recipient=self.resident,
            courier='UPS',
            tracking_number='123456',
            status='received'
        )
        
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get('/api/packages/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class MaintenanceRequestViewSetTestCase(APITestCase):
    """Test MaintenanceRequest API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        
        self.resident_user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        
        self.staff_user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position='Maintenance',
            department='Operations',
            hire_date=date.today()
        )
    
    def test_create_maintenance_request(self):
        """Test resident can create maintenance request"""
        refresh = RefreshToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        data = {
            'title': 'Leaky Faucet',
            'description': 'Kitchen faucet is dripping',
            'priority': 'medium'
        }
        
        response = self.client.post('/api/maintenance-requests/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify request was created
        self.assertTrue(
            MaintenanceRequest.objects.filter(
                resident=self.resident,
                title='Leaky Faucet'
            ).exists()
        )
    
    def test_update_maintenance_status(self):
        """Test updating maintenance request status"""
        request = MaintenanceRequest.objects.create(
            resident=self.resident,
            title='Leaky Faucet',
            description='Kitchen faucet is dripping',
            status='pending',
            priority='medium'
        )
        
        refresh = RefreshToken.for_user(self.staff_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.post(
            f'/api/maintenance-requests/{request.id}/update_status/',
            {'status': 'in_progress'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify status was updated
        request.refresh_from_db()
        self.assertEqual(request.status, 'in_progress')
