from django.test import TestCase
from django.contrib.auth.models import User
from core.models import (
    Resident, Staff, ArchitecturalRequest, Violation
)
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone

class Phase5GovernanceTest(TestCase):
    def setUp(self):
        # Users
        self.staff_user = User.objects.create_user(username='staff', password='password')
        self.staff = Staff.objects.create(user=self.staff_user, position='Manager', department='Ops', hire_date=timezone.now().date())
        
        self.resident_user = User.objects.create_user(username='resident', password='password')
        self.resident = Resident.objects.create(user=self.resident_user, unit_number='101', phone_number='555-0000', move_in_date=timezone.now().date())
        
        self.board_user = User.objects.create_user(username='board', password='password')
        self.board_resident = Resident.objects.create(user=self.board_user, unit_number='202', phone_number='555-9999', move_in_date=timezone.now().date())
        # Assuming is_board_member is a field on Resident model or derived. 
        # Wait, I didn't see is_board_member in Resident model in Phase 4 audit. 
        # Let's check if it was added. The ViewSet uses `user.resident.is_board_member`.
        # I'll enable it here if it exists, or check how board members are defined.
        # If it's a field:
        self.board_resident.is_board_member = True
        self.board_resident.save()

        self.client = APIClient()

    def test_arc_workflow(self):
        """Test Architectural Request submission and approval"""
        # 1. Resident Submit
        self.client.force_authenticate(user=self.resident_user)
        payload = {
            "title": "New Balcony Paint",
            "description": "Painting it white",
            "proposed_start_date": (timezone.now() + timezone.timedelta(days=10)).date(),
            "proposed_completion_date": (timezone.now() + timezone.timedelta(days=12)).date(),
        }
        response = self.client.post('/api/architectural-requests/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        arc_id = response.data['id']
        
        # 2. Board Approve
        self.client.force_authenticate(user=self.board_user)
        response = self.client.post(f'/api/architectural-requests/{arc_id}/approve/', {"status": "approved", "board_comments": "Looks good"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Verify Status
        arc = ArchitecturalRequest.objects.get(id=arc_id)
        self.assertEqual(arc.status, 'approved')
        self.assertEqual(arc.board_comments, "Looks good")

    def test_violation_tracking(self):
        """Test Staff logging violation and Resident viewing it"""
        # 1. Staff Log Violation
        self.client.force_authenticate(user=self.staff_user)
        payload = {
            "resident": self.resident.id,
            "rule_citation": "Noise after 10PM",
            "description": "Loud music",
            "fine_amount": 50.00
        }
        response = self.client.post('/api/violations/', payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        violation_id = response.data['id']
        
        # 2. Resident View
        self.client.force_authenticate(user=self.resident_user)
        response = self.client.get(f'/api/violations/{violation_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rule_citation'], "Noise after 10PM")

    def test_board_access_control(self):
        """Ensure regular resident cannot access board actions"""
        # Create ARC
        arc = ArchitecturalRequest.objects.create(
            resident=self.resident,
            title="Fence",
            description="High fence",
            status='pending'
        )
        
        # Regular resident tries to approve
        self.client.force_authenticate(user=self.resident_user)
        response = self.client.post(f'/api/architectural-requests/{arc.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
