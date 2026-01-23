from django.test import TestCase
from django.contrib.auth.models import User
from datetime import date, datetime, time, timedelta
from .models import (
    Resident, Staff, Poll, PollOption, PollVote,
    IncidentReport, Event, Package, MaintenanceRequest,
    Amenity, AmenityBooking, Payment
)


class ResidentModelTest(TestCase):
    """Test cases for the Resident model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_resident_creation(self):
        """Test creating a resident"""
        resident = Resident.objects.create(
            user=self.user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        self.assertEqual(resident.unit_number, '101')
        self.assertEqual(resident.user.email, 'test@example.com')
    
    def test_resident_user_relationship(self):
        """Test one-to-one relationship with User"""
        resident = Resident.objects.create(
            user=self.user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
        self.assertEqual(self.user.resident, resident)


class StaffModelTest(TestCase):
    """Test cases for the Staff model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='staffpass123'
        )
    
    def test_staff_creation(self):
        """Test creating a staff member"""
        staff = Staff.objects.create(
            user=self.user,
            position='Maintenance Manager',
            department='Operations',
            hire_date=date.today()
        )
        self.assertEqual(staff.position, 'Maintenance Manager')
        self.assertEqual(staff.user.email, 'staff@example.com')


class PollModelTest(TestCase):
    """Test cases for Poll, PollOption, and PollVote models"""
    
    def setUp(self):
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
    
    def test_poll_creation(self):
        """Test creating a poll"""
        poll = Poll.objects.create(
            question='Should we renovate the pool?',
            created_by=self.staff,
            is_active=True
        )
        self.assertEqual(poll.question, 'Should we renovate the pool?')
        self.assertTrue(poll.is_active)
    
    def test_poll_options(self):
        """Test creating poll options"""
        poll = Poll.objects.create(
            question='Should we renovate the pool?',
            created_by=self.staff
        )
        option1 = PollOption.objects.create(poll=poll, text='Yes')
        option2 = PollOption.objects.create(poll=poll, text='No')
        
        self.assertEqual(poll.options.count(), 2)
        self.assertIn(option1, poll.options.all())
        self.assertIn(option2, poll.options.all())
    
    def test_poll_vote_creation(self):
        """Test creating a poll vote"""
        poll = Poll.objects.create(
            question='Should we renovate the pool?',
            created_by=self.staff
        )
        option = PollOption.objects.create(poll=poll, text='Yes')
        
        vote = PollVote.objects.create(
            poll=poll,
            option=option,
            resident=self.resident
        )
        self.assertEqual(vote.resident, self.resident)
        self.assertEqual(vote.option, option)
    
    def test_poll_vote_unique_constraint(self):
        """Test that a resident can only vote once per poll"""
        poll = Poll.objects.create(
            question='Should we renovate the pool?',
            created_by=self.staff
        )
        option1 = PollOption.objects.create(poll=poll, text='Yes')
        option2 = PollOption.objects.create(poll=poll, text='No')
        
        # First vote should succeed
        PollVote.objects.create(
            poll=poll,
            option=option1,
            resident=self.resident
        )
        
        # Second vote should fail due to unique_together constraint
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            PollVote.objects.create(
                poll=poll,
                option=option2,
                resident=self.resident
            )


class IncidentReportModelTest(TestCase):
    """Test cases for the IncidentReport model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
    
    def test_incident_creation(self):
        """Test creating an incident report"""
        incident = IncidentReport.objects.create(
            resident=self.resident,
            title='Broken Window',
            description='Window in lobby is cracked',
            location='Main Lobby',
            status='open'
        )
        self.assertEqual(incident.title, 'Broken Window')
        self.assertEqual(incident.status, 'open')
    
    def test_incident_status_choices(self):
        """Test incident status transitions"""
        incident = IncidentReport.objects.create(
            resident=self.resident,
            title='Broken Window',
            description='Window in lobby is cracked',
            status='open'
        )
        
        # Update status
        incident.status = 'investigating'
        incident.save()
        self.assertEqual(incident.status, 'investigating')
        
        incident.status = 'resolved'
        incident.save()
        self.assertEqual(incident.status, 'resolved')


class EventModelTest(TestCase):
    """Test cases for the Event model"""
    
    def setUp(self):
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
    
    def test_event_creation(self):
        """Test creating an event"""
        event_date = datetime.now() + timedelta(days=7)
        event = Event.objects.create(
            title='Summer BBQ',
            description='Annual community BBQ event',
            date=event_date,
            location='Pool Area',
            created_by=self.staff,
            is_active=True
        )
        self.assertEqual(event.title, 'Summer BBQ')
        self.assertEqual(event.location, 'Pool Area')
        self.assertTrue(event.is_active)


class PackageModelTest(TestCase):
    """Test cases for the Package model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='residentuser',
            email='resident@example.com',
            password='residentpass123'
        )
        self.resident = Resident.objects.create(
            user=self.user,
            unit_number='101',
            phone_number='555-1234',
            move_in_date=date.today()
        )
    
    def test_package_creation(self):
        """Test creating a package"""
        package = Package.objects.create(
            recipient=self.resident,
            courier='UPS',
            tracking_number='1Z999AA10123456784',
            status='received'
        )
        self.assertEqual(package.courier, 'UPS')
        self.assertEqual(package.status, 'received')
        self.assertIsNone(package.pickup_date)
    
    def test_package_pickup(self):
        """Test marking package as picked up"""
        package = Package.objects.create(
            recipient=self.resident,
            courier='FedEx',
            status='received'
        )
        
        # Mark as picked up
        package.status = 'picked_up'
        package.pickup_date = datetime.now()
        package.save()
        
        self.assertEqual(package.status, 'picked_up')
        self.assertIsNotNone(package.pickup_date)
    
    def test_package_string_representation(self):
        """Test package __str__ method"""
        package = Package.objects.create(
            recipient=self.resident,
            courier='Amazon',
            status='received'
        )
        expected_str = f"Package for {self.resident} from Amazon"
        self.assertEqual(str(package), expected_str)


class MaintenanceRequestModelTest(TestCase):
    """Test cases for the MaintenanceRequest model"""
    
    def setUp(self):
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
    
    def test_maintenance_request_creation(self):
        """Test creating a maintenance request"""
        request = MaintenanceRequest.objects.create(
            resident=self.resident,
            title='Leaky Faucet',
            description='Kitchen faucet is dripping',
            status='new',
            priority='medium'
        )
        self.assertEqual(request.title, 'Leaky Faucet')
        self.assertEqual(request.status, 'new')
        self.assertEqual(request.priority, 'medium')
    
    def test_maintenance_request_assignment(self):
        """Test assigning maintenance request to staff"""
        request = MaintenanceRequest.objects.create(
            resident=self.resident,
            title='Leaky Faucet',
            description='Kitchen faucet is dripping',
            status='new',
            priority='high'
        )
        
        # Assign to staff
        request.assigned_to = self.staff
        request.status = 'assigned'
        request.save()
        
        self.assertEqual(request.assigned_to, self.staff)
        self.assertEqual(request.status, 'assigned')
    
    def test_maintenance_request_completion(self):
        """Test completing a maintenance request"""
        request = MaintenanceRequest.objects.create(
            resident=self.resident,
            title='Leaky Faucet',
            description='Kitchen faucet is dripping',
            status='in_progress',
            assigned_to=self.staff,
            priority='medium'
        )
        
        # Complete the request
        request.status = 'completed'
        request.completion_notes = 'Replaced faucet washer'
        request.save()
        
        self.assertEqual(request.status, 'completed')
        self.assertEqual(request.completion_notes, 'Replaced faucet washer')
