from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement, Package, Poll, PollOption, PollVote,
    IncidentReport, Event, Notification, ArchitecturalRequest, Violation
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

class ResidentCreateSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Resident
        fields = ('user', 'phone_number', 'unit_number', 'move_in_date')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        resident = Resident.objects.create(user=user, **validated_data)
        return resident

class ResidentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resident
        fields = ('id', 'unit_number', 'phone_number', 'move_in_date', 'is_board_member')

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
    class Meta:
        model = MaintenanceRequest
        fields = (
            'id',
            'resident',
            'title',
            'description',
            'status',
            'priority',
            'assigned_to',
            'completion_notes',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'resident',
            'status',
            'assigned_to',
            'completion_notes',
            'created_at',
            'updated_at',
        )
        extra_kwargs = {
            'priority': {'required': True},
        }


class MaintenanceRequestUpdateSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = MaintenanceRequest
        fields = ('id', 'status', 'assigned_to', 'completion_notes', 'updated_at')
        read_only_fields = ('id', 'updated_at')

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
    vote_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PollOption
        fields = ['id', 'poll', 'text', 'vote_count']
    
    def get_vote_count(self, obj):
        return PollVote.objects.filter(option=obj).count()

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    user_vote = serializers.SerializerMethodField()
    vote_counts = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        fields = ['id', 'question', 'created_at', 'is_active', 'created_by', 'options', 'user_vote', 'vote_counts', 'is_board_only']
        read_only_fields = ['created_by', 'created_at']

    def get_user_vote(self, obj):
        user = self.context['request'].user
        if not hasattr(user, 'resident'):
            return None
        vote = PollVote.objects.filter(poll=obj, resident=user.resident).first()
        return vote.option.id if vote else None

    def get_vote_counts(self, obj):
        counts = {}
        for option in obj.options.all():
            counts[option.id] = PollVote.objects.filter(poll=obj, option=option).count()
        return counts

class ArchitecturalRequestSerializer(serializers.ModelSerializer):
    resident_name = serializers.CharField(source='resident.user.get_full_name', read_only=True)
    unit_number = serializers.CharField(source='resident.unit_number', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.user.get_full_name', read_only=True)

    class Meta:
        model = ArchitecturalRequest
        fields = '__all__'
        read_only_fields = ['resident', 'submitted_at', 'status', 'reviewed_at', 'reviewed_by', 'board_comments']

class ViolationSerializer(serializers.ModelSerializer):
    resident_name = serializers.CharField(source='resident.user.get_full_name', read_only=True)
    unit_number = serializers.CharField(source='resident.unit_number', read_only=True)
    logged_by_name = serializers.CharField(source='logged_by.user.get_full_name', read_only=True)

    class Meta:
        model = Violation
        fields = '__all__'
        read_only_fields = ['logged_by', 'logged_at', 'resolved_at']

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
    resident_name = serializers.SerializerMethodField()
    
    class Meta:
        model = IncidentReport
        fields = '__all__'
        read_only_fields = ['resident']
    
    def get_resident_name(self, obj):
        return f"{obj.resident.user.first_name} {obj.resident.user.last_name}"

class EventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_by']
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.user.first_name} {obj.created_by.user.last_name}"

class NotificationSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ('id', 'message', 'type', 'is_read', 'created_at', 'content_type', 'object_id', 'title')
        read_only_fields = ('id', 'message', 'type', 'is_read', 'created_at', 'content_type', 'object_id', 'title')

    def get_title(self, obj):
        if hasattr(obj.content_object, 'title'):
            return obj.content_object.title
        return None
