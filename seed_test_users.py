import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'condo_backend.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Resident, Staff

def seed():
    # Create Staff
    u_staff, _ = User.objects.get_or_create(username='staff@example.com', email='staff@example.com')
    u_staff.set_password('password')
    u_staff.save()
    Staff.objects.get_or_create(user=u_staff, defaults={'position': 'Manager', 'department': 'Operations', 'hire_date': '2020-01-01'})

    # Create Resident
    u_res, _ = User.objects.get_or_create(username='resident@example.com', email='resident@example.com')
    u_res.set_password('password')
    u_res.save()
    Resident.objects.get_or_create(user=u_res, defaults={'unit_number': '101', 'phone_number': '555-0101', 'move_in_date': '2023-01-01'})

    # Create Board Member
    u_board, _ = User.objects.get_or_create(username='board@example.com', email='board@example.com')
    u_board.set_password('password')
    u_board.save()
    r_board, _ = Resident.objects.get_or_create(user=u_board, defaults={'unit_number': '202', 'phone_number': '555-2020', 'move_in_date': '2022-01-01'})
    r_board.is_board_member = True
    r_board.save()

    print("Seed complete.")

if __name__ == "__main__":
    seed()
