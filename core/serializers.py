from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class ResidentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Resident
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class AmenityBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmenityBooking
        fields = '__all__'

class ParkingSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSpot
        fields = '__all__'

class VisitorParkingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorParking
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'

class ForumCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumComment
        fields = '__all__'

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Staff
        fields = '__all__'