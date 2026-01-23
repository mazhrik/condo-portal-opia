from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from core.models import Announcement, Resident, Staff


class AnnouncementTests(APITestCase):
    def setUp(self):
        self.password = "strong-password"
        self.resident_user = User.objects.create_user(
            username="resident3@example.com",
            email="resident3@example.com",
            password=self.password,
        )
        Resident.objects.create(
            user=self.resident_user,
            unit_number="103",
            phone_number="555-0103",
            move_in_date="2024-03-01",
        )

        self.manager_user = User.objects.create_user(
            username="manager3@example.com",
            email="manager3@example.com",
            password=self.password,
        )
        Staff.objects.create(
            user=self.manager_user,
            position="Manager",
            department="Operations",
            hire_date="2023-03-01",
        )

        self.admin_user = User.objects.create_user(
            username="admin3@example.com",
            email="admin3@example.com",
            password=self.password,
            is_staff=True,
        )

    def authenticate(self, user):
        token = AccessToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_resident_cannot_create_or_update(self):
        announcement = Announcement.objects.create(
            title="Active",
            content="Hello",
            is_active=True,
            created_by=self.manager_user,
        )

        self.authenticate(self.resident_user)
        create_response = self.client.post(
            "/api/announcements/",
            {"title": "New", "content": "Body", "is_active": True},
            format="json",
        )
        self.assertEqual(create_response.status_code, 403)

        update_response = self.client.patch(
            f"/api/announcements/{announcement.id}/",
            {"title": "Updated"},
            format="json",
        )
        self.assertEqual(update_response.status_code, 403)

    def test_inactive_announcements_hidden_from_residents(self):
        active = Announcement.objects.create(
            title="Active",
            content="Visible",
            is_active=True,
            created_by=self.manager_user,
        )
        inactive = Announcement.objects.create(
            title="Inactive",
            content="Hidden",
            is_active=False,
            created_by=self.manager_user,
        )

        self.authenticate(self.resident_user)
        list_response = self.client.get("/api/announcements/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.data["count"], 1)
        self.assertEqual(list_response.data["results"][0]["id"], active.id)

        detail_response = self.client.get(f"/api/announcements/{inactive.id}/")
        self.assertEqual(detail_response.status_code, 404)

    def test_admin_manager_can_create_update_and_filter(self):
        self.authenticate(self.manager_user)
        create_response = self.client.post(
            "/api/announcements/",
            {"title": "Manager Post", "content": "Body", "is_active": True},
            format="json",
        )
        self.assertEqual(create_response.status_code, 201)
        created_id = create_response.data["id"]

        patch_response = self.client.patch(
            f"/api/announcements/{created_id}/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(patch_response.status_code, 200)
        self.assertFalse(patch_response.data["is_active"])

        self.authenticate(self.admin_user)
        list_inactive = self.client.get("/api/announcements/?is_active=false")
        self.assertEqual(list_inactive.status_code, 200)
        self.assertGreaterEqual(list_inactive.data["count"], 1)


class DashboardSummaryTests(APITestCase):
    def setUp(self):
        self.password = "strong-password"
        self.resident_user = User.objects.create_user(
            username="resident4@example.com",
            email="resident4@example.com",
            password=self.password,
        )
        Resident.objects.create(
            user=self.resident_user,
            unit_number="104",
            phone_number="555-0104",
            move_in_date="2024-04-01",
        )

        self.manager_user = User.objects.create_user(
            username="manager4@example.com",
            email="manager4@example.com",
            password=self.password,
        )
        Staff.objects.create(
            user=self.manager_user,
            position="Manager",
            department="Operations",
            hire_date="2023-04-01",
        )

        Announcement.objects.create(
            title="Active 1",
            content="Visible",
            is_active=True,
            created_by=self.manager_user,
        )
        Announcement.objects.create(
            title="Inactive 1",
            content="Hidden",
            is_active=False,
            created_by=self.manager_user,
        )

    def authenticate(self, user):
        token = AccessToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_dashboard_summary_counts_active_announcements(self):
        self.authenticate(self.resident_user)
        response = self.client.get("/api/dashboard/summary")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["announcements"]["active_count"], 1)
        self.assertEqual(len(response.data["announcements"]["latest"]), 1)
