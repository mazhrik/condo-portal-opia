from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from core.models import Resident, Staff


class RBACTests(APITestCase):
    def setUp(self):
        self.password = "strong-password"
        self.resident_user = User.objects.create_user(
            username="resident2@example.com",
            email="resident2@example.com",
            password=self.password,
        )
        Resident.objects.create(
            user=self.resident_user,
            unit_number="102",
            phone_number="555-0102",
            move_in_date="2024-02-01",
        )
        self.manager_user = User.objects.create_user(
            username="manager2@example.com",
            email="manager2@example.com",
            password=self.password,
        )
        Staff.objects.create(
            user=self.manager_user,
            position="Manager",
            department="Operations",
            hire_date="2023-02-01",
        )

    def test_resident_access_denied(self):
        response = self.client.get("/api/residents/")
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.data)

        token = AccessToken.for_user(self.resident_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        forbidden_response = self.client.get("/api/residents/")
        self.assertEqual(forbidden_response.status_code, 403)
        self.assertIn("error", forbidden_response.data)

    def test_manager_access_allowed(self):
        token = AccessToken.for_user(self.manager_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/residents/")
        self.assertEqual(response.status_code, 200)
