from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement, Package, Poll, PollOption, PollVote,
    IncidentReport, Event
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


class ResidentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resident
        fields = ('id', 'unit_number', 'phone_number', 'move_in_date')

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = (
            'id',
            'title',
            'content',
            'is_active',
            'created_at',
            'updated_at',
        )

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    resident_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = MaintenanceRequest
        fields = '__all__'
        read_only_fields = ['resident']

    def get_resident_name(self, obj):
        return f"{obj.resident.user.first_name} {obj.resident.user.last_name}"

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.user.first_name} {obj.assigned_to.user.last_name}"
        return None

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        instance = getattr(self, "instance", None)

        # Enforce status transitions on updates
        if instance and "status" in attrs:
            from_status = instance.status
            to_status = attrs["status"]
            allowed = {
                "new": {"in_review"},
                "in_review": {"assigned"},
                "assigned": {"in_progress"},
                "in_progress": {"completed"},
                "completed": {"closed"},
                "closed": set(),
            }

            if from_status != to_status:
                is_admin = bool(user and (user.is_superuser or user.is_staff))
                if to_status == "closed" and is_admin:
                    pass
                elif to_status not in allowed.get(from_status, set()):
                    raise serializers.ValidationError({
                        "status": f"Cannot transition from {from_status} to {to_status}."
                    })

        if attrs.get("status") == "completed" and not attrs.get("completion_notes"):
            raise serializers.ValidationError({
                "completion_notes": "completion_notes is required when status is completed."
            })

        assigned_to = attrs.get("assigned_to")
        if assigned_to and not isinstance(assigned_to, Staff):
            raise serializers.ValidationError({
                "assigned_to": "assigned_to must reference a staff user."
            })

        return attrs

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


class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ('id', 'position', 'department', 'hire_date')

class PackageSerializer(serializers.ModelSerializer):
    recipient_name = serializers.SerializerMethodField()
    unit_number = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = '__all__'

    def get_recipient_name(self, obj):
        return f"{obj.recipient.user.first_name} {obj.recipient.user.last_name}"

    def get_unit_number(self, obj):
        return obj.recipient.unit_number

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        user = authenticate(username=email, password=password)
        if not user:
            raise AuthenticationFailed("No active account found with the given credentials")

        self.user = user
        refresh = self.get_token(self.user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        data.update({
            'user_id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
        })

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email  # Add email in JWT payload
        return token

class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = '__all__'

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Poll
        fields = '__all__'
        read_only_fields = ['created_by']

class PollVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollVote
        fields = '__all__'
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=PollVote.objects.all(),
                fields=['poll', 'resident']
            )
        ]

class IncidentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentReport
        fields = '__all__'
        read_only_fields = ['resident']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
