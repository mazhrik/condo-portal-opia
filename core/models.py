from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

class Resident(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    unit_number = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    move_in_date = models.DateField()

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='announcements',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_review', 'In Review'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('closed', 'Closed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey('Staff', on_delete=models.SET_NULL, null=True, blank=True)
    completion_notes = models.TextField(blank=True, null=True)

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    payment_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

class Amenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    capacity = models.IntegerField()
    is_active = models.BooleanField(default=True)
    opening_time = models.TimeField()
    closing_time = models.TimeField()

class AmenityBooking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

class ParkingSpot(models.Model):
    spot_number = models.CharField(max_length=10)
    is_visitor = models.BooleanField(default=False)
    is_occupied = models.BooleanField(default=False)
    resident = models.ForeignKey(Resident, on_delete=models.SET_NULL, null=True, blank=True)

class VisitorParking(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    visitor_name = models.CharField(max_length=100)
    vehicle_number = models.CharField(max_length=20)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('rules', 'Building Rules'),
        ('lease', 'Lease Agreement'),
        ('guidelines', 'Community Guidelines'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class ForumPost(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

class ForumComment(models.Model):
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class EmergencyContact(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    is_active = models.BooleanField(default=True)

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    hire_date = models.DateField()

class Package(models.Model):
    STATUS_CHOICES = [
        ('received', 'Received'),
        ('picked_up', 'Picked Up'),
    ]

    recipient = models.ForeignKey(Resident, on_delete=models.CASCADE)
    courier = models.CharField(max_length=100)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    arrival_date = models.DateTimeField(auto_now_add=True)
    pickup_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Package for {self.recipient} from {self.courier}"

class Poll(models.Model):
    question = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey('Staff', on_delete=models.CASCADE)

class PollOption(models.Model):
    poll = models.ForeignKey(Poll, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)

class PollVote(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    option = models.ForeignKey(PollOption, on_delete=models.CASCADE)
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll', 'resident')

class IncidentReport(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
    ]
    
    resident = models.ForeignKey('Resident', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='incidents/', blank=True, null=True)

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey('Staff', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
