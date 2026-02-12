
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create regular user
if not User.objects.filter(email="user@example.com").exists():
    User.objects.create_user("user@example.com", "user@example.com", "userpass")
    print("Created regular user: user@example.com")

# Create superuser
if not User.objects.filter(email="admin@example.com").exists():
    User.objects.create_superuser("admin@example.com", "admin@example.com", "adminpass")
    print("Created superuser: admin@example.com")

print("Seed complete.")
