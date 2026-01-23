from datetime import timedelta

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from core.models import Resident, Staff


class AuthTests(APITestCase):
    def setUp(self):
        self.password = "strong-password"
        self.user = User.objects.create_user(
            username="resident@example.com",
            email="resident@example.com",
            password=self.password,
        )
        self.resident = Resident.objects.create(
            user=self.user,
            unit_number="101",
            phone_number="555-0101",
            move_in_date="2024-01-01",
        )
        self.staff_user = User.objects.create_user(
            username="manager@example.com",
            email="manager@example.com",
            password=self.password,
        )
        self.staff = Staff.objects.create(
            user=self.staff_user,
            position="Manager",
            department="Operations",
            hire_date="2023-01-01",
        )

    def test_login_refresh_logout_flow(self):
        login_response = self.client.post(
            "/api/token/",
            {"email": self.user.email, "password": self.password},
            format="json",
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertIn("access", login_response.data)
        self.assertIn("refresh", login_response.data)
        self.assertEqual(login_response.data["user_id"], self.user.id)
        self.assertEqual(login_response.data["email"], self.user.email)
        self.assertIn("first_name", login_response.data)
        self.assertIn("last_name", login_response.data)
        self.assertIn("is_staff", login_response.data)
        self.assertIn("is_superuser", login_response.data)

        refresh_response = self.client.post(
            "/api/token/refresh/",
            {"refresh": login_response.data["refresh"]},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, 200)
        self.assertIn("access", refresh_response.data)

    def test_me_requires_valid_token(self):
        response = self.client.get("/api/me")
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.data)

        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalid")
        invalid_response = self.client.get("/api/me")
        self.assertEqual(invalid_response.status_code, 401)
        self.assertIn("error", invalid_response.data)

        token = AccessToken.for_user(self.user)
        token.set_exp(lifetime=timedelta(seconds=-1))
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        expired_response = self.client.get("/api/me")
        self.assertEqual(expired_response.status_code, 401)
        self.assertIn("error", expired_response.data)

    def test_me_returns_role(self):
        token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/me")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["role"], "resident")
        self.assertEqual(response.data["email"], self.user.email)
        self.assertIsNotNone(response.data["resident"])

    def test_jwt_access_token_valid(self):
        token = AccessToken.for_user(self.staff_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/me")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["role"], "manager")
        self.assertIsNotNone(response.data["staff"])

    def test_invalid_refresh_token(self):
        response = self.client.post(
            "/api/token/refresh/", {"refresh": "invalid"}, format="json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.data)

    def test_refresh_token_for_user(self):
        refresh = RefreshToken.for_user(self.user)
        response = self.client.post(
            "/api/token/refresh/", {"refresh": str(refresh)}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
