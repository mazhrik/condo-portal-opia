
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "condo_backend.settings")
django.setup()

User = get_user_model()

# Create a regular user
if not User.objects.filter(email="user@example.com").exists():
    User.objects.create_user("user@example.com", "userpass")
    print("Created regular user: user@example.com")

# Create a superuser
if not User.objects.filter(email="admin@example.com").exists():
    User.objects.create_superuser("admin@example.com", "adminpass")
    print("Created superuser: admin@example.com")

print("Seed complete.")
