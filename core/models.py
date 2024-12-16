from django.db import models
from django.contrib.auth.models import User

class Resident(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    unit_number = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    move_in_date = models.DateField()

class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Payment(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)

class Amenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    capacity = models.IntegerField()
    is_active = models.BooleanField(default=True)

class AmenityBooking(models.Model):
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20)

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    hire_date = models.DateField()