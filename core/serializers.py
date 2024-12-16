from rest_framework import serializers
from .models import Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking, Staff
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class ResidentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Resident
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

class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Staff
        fields = '__all__'