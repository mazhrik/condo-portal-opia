from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from core.models import MaintenanceRequest, Resident, Staff


class MaintenanceRequestAPITests(APITestCase):
    def setUp(self):
        self.password = "strong-password"
        self.resident_user = User.objects.create_user(
            username="resident5@example.com",
            email="resident5@example.com",
            password=self.password,
        )
        self.resident = Resident.objects.create(
            user=self.resident_user,
            unit_number="105",
            phone_number="555-0105",
            move_in_date="2024-05-01",
        )

        self.other_user = User.objects.create_user(
            username="resident6@example.com",
            email="resident6@example.com",
            password=self.password,
        )
        self.other_resident = Resident.objects.create(
            user=self.other_user,
            unit_number="106",
            phone_number="555-0106",
            move_in_date="2024-06-01",
        )

        self.manager_user = User.objects.create_user(
            username="manager5@example.com",
            email="manager5@example.com",
            password=self.password,
        )
        self.manager_staff = Staff.objects.create(
            user=self.manager_user,
            position="Manager",
            department="Operations",
            hire_date="2023-05-01",
        )

        self.admin_user = User.objects.create_user(
            username="admin5@example.com",
            email="admin5@example.com",
            password=self.password,
            is_staff=True,
        )

    def authenticate(self, user):
        token = AccessToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_resident_list_and_detail_scoped(self):
        own_request = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Own",
            description="Own issue",
            priority="medium",
        )
        MaintenanceRequest.objects.create(
            resident=self.other_resident,
            title="Other",
            description="Other issue",
            priority="low",
        )

        self.authenticate(self.resident_user)
        response = self.client.get("/api/maintenance-requests/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], own_request.id)

        detail_response = self.client.get(
            f"/api/maintenance-requests/{own_request.id}/"
        )
        self.assertEqual(detail_response.status_code, 200)

        other_detail = self.client.get(
            f"/api/maintenance-requests/{MaintenanceRequest.objects.exclude(id=own_request.id).first().id}/"
        )
        self.assertEqual(other_detail.status_code, 404)

    def test_resident_cannot_update_or_assign(self):
        request_obj = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Leaky faucet",
            description="Kitchen faucet",
            priority="medium",
        )

        self.authenticate(self.resident_user)
        response = self.client.patch(
            f"/api/maintenance-requests/{request_obj.id}/",
            {"status": "in_review"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_manager_can_filter_and_assign(self):
        first = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="First",
            description="Issue one",
            priority="high",
            status="new",
        )
        MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Second",
            description="Issue two",
            priority="low",
            status="in_review",
        )

        self.authenticate(self.manager_user)
        response = self.client.get("/api/maintenance-requests/?status=new")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], first.id)

        assign_response = self.client.patch(
            f"/api/maintenance-requests/{first.id}/",
            {"status": "in_review"},
            format="json",
        )
        self.assertEqual(assign_response.status_code, 200)

        assign_response = self.client.patch(
            f"/api/maintenance-requests/{first.id}/",
            {"status": "assigned", "assigned_to": self.manager_staff.id},
            format="json",
        )
        self.assertEqual(assign_response.status_code, 200)
        self.assertEqual(assign_response.data["assigned_to"], self.manager_staff.id)

    def test_assignment_requires_staff(self):
        request_obj = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Assign",
            description="Assign test",
            priority="medium",
            status="in_review",
        )

        self.authenticate(self.manager_user)
        response = self.client.patch(
            f"/api/maintenance-requests/{request_obj.id}/",
            {"status": "assigned", "assigned_to": 9999},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_transition_returns_error(self):
        request_obj = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Transition",
            description="Check transitions",
            priority="medium",
            status="new",
        )

        self.authenticate(self.manager_user)
        response = self.client.patch(
            f"/api/maintenance-requests/{request_obj.id}/",
            {"status": "completed"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["code"], "invalid_transition")

    def test_completion_requires_notes(self):
        request_obj = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Complete",
            description="Check notes",
            priority="medium",
            status="in_progress",
        )

        self.authenticate(self.manager_user)
        response = self.client.patch(
            f"/api/maintenance-requests/{request_obj.id}/",
            {"status": "completed"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["code"], "completion_notes_required")

    def test_admin_can_close_from_any_state(self):
        request_obj = MaintenanceRequest.objects.create(
            resident=self.resident,
            title="Close",
            description="Admin close",
            priority="medium",
            status="new",
        )

        self.authenticate(self.admin_user)
        response = self.client.patch(
            f"/api/maintenance-requests/{request_obj.id}/",
            {"status": "closed"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "closed")

    def test_pagination_applies(self):
        for idx in range(25):
            MaintenanceRequest.objects.create(
                resident=self.resident,
                title=f"Req {idx}",
                description="Bulk",
                priority="low",
            )

        self.authenticate(self.manager_user)
        response = self.client.get("/api/maintenance-requests/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 25)
        self.assertEqual(len(response.data["results"]), 20)
