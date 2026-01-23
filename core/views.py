from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.views import APIView
from datetime import datetime, time
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate

from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement, Package, Poll, PollOption, PollVote,
    IncidentReport, Event
)

from .serializers import (
    ResidentSerializer, MaintenanceRequestSerializer, PaymentSerializer,
    AmenitySerializer, AmenityBookingSerializer, ParkingSpotSerializer,
    VisitorParkingSerializer, DocumentSerializer, ForumPostSerializer,
    ForumCommentSerializer, EmergencyContactSerializer, StaffSerializer,
    AnnouncementSerializer, PackageSerializer, PollSerializer,
    PollOptionSerializer, PollVoteSerializer, IncidentReportSerializer,
    EventSerializer, ResidentProfileSerializer, StaffProfileSerializer,
    MaintenanceRequestUpdateSerializer
)
from .permissions import IsAdminOrManager, IsResident
from .pagination import AnnouncementPagination, MaintenanceRequestPagination
from .roles import ROLE_ADMIN, ROLE_PROPERTY_MANAGER, ROLE_RESIDENT, get_user_role


class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = AnnouncementPagination
    queryset = Announcement.objects.all()

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrManager()]

    def get_queryset(self):
        queryset = Announcement.objects.all().order_by('-created_at')
        role = get_user_role(self.request.user)
        is_active_param = self.request.query_params.get('is_active')

        if role in (ROLE_ADMIN, ROLE_PROPERTY_MANAGER):
            if self.action != 'list':
                return queryset
            if is_active_param is None:
                return queryset.filter(is_active=True)
            if str(is_active_param).lower() in ('1', 'true', 't', 'yes'):
                return queryset.filter(is_active=True)
            if str(is_active_param).lower() in ('0', 'false', 'f', 'no'):
                return queryset.filter(is_active=False)
            return queryset
        return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MaintenanceRequestPagination
    queryset = MaintenanceRequest.objects.all()
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_permissions(self):
        if self.action in ("update", "partial_update"):
            return [IsAuthenticated(), IsAdminOrManager()]
        if self.action == "create":
            return [IsAuthenticated(), IsResident()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        role = get_user_role(user)
        queryset = MaintenanceRequest.objects.all().order_by('-created_at')

        if role in (ROLE_ADMIN, ROLE_PROPERTY_MANAGER):
            if self.action == "list":
                status_value = self.request.query_params.get("status")
                priority_value = self.request.query_params.get("priority")
                assigned_to = self.request.query_params.get("assigned_to")
                resident_id = self.request.query_params.get("resident_id")
                created_from = self.request.query_params.get("created_from")
                created_to = self.request.query_params.get("created_to")
                query = self.request.query_params.get("q")

                if status_value:
                    queryset = queryset.filter(status=status_value)
                if priority_value:
                    queryset = queryset.filter(priority=priority_value)
                if assigned_to:
                    try:
                        queryset = queryset.filter(assigned_to_id=int(assigned_to))
                    except ValueError:
                        pass
                if resident_id:
                    try:
                        queryset = queryset.filter(resident_id=int(resident_id))
                    except ValueError:
                        pass
                if created_from:
                    created_from_dt = self._parse_datetime_param(created_from, is_end=False)
                    if created_from_dt:
                        queryset = queryset.filter(created_at__gte=created_from_dt)
                if created_to:
                    created_to_dt = self._parse_datetime_param(created_to, is_end=True)
                    if created_to_dt:
                        queryset = queryset.filter(created_at__lte=created_to_dt)
                if query:
                    queryset = queryset.filter(
                        Q(title__icontains=query) | Q(description__icontains=query)
                    )
            return queryset

        if role == ROLE_RESIDENT and hasattr(user, "resident"):
            return queryset.filter(resident=user.resident)
        return MaintenanceRequest.objects.none()

    def perform_create(self, serializer):
        resident = get_object_or_404(Resident, user=self.request.user)
        serializer.save(resident=resident)

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return MaintenanceRequestUpdateSerializer
        return MaintenanceRequestSerializer

    def update(self, request, *args, **kwargs):
        return self._update_request(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self._update_request(request, *args, **kwargs)

    def _update_request(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if "status" in serializer.validated_data:
            status_value = serializer.validated_data["status"]
            transition_error = self._validate_transition(request.user, instance.status, status_value)
            if transition_error:
                return Response(
                    {
                        "error": {
                            "code": "invalid_transition",
                            "message": transition_error["message"],
                            "details": transition_error["details"],
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if status_value == "completed":
                completion_notes = serializer.validated_data.get("completion_notes")
                if not completion_notes:
                    return Response(
                        {
                            "error": {
                                "code": "completion_notes_required",
                                "message": "Completion notes are required when completing a request.",
                                "details": {"status": "completed"},
                            }
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        serializer.save()
        return Response(serializer.data)

    def _validate_transition(self, user, current_status, next_status):
        if current_status == next_status:
            return None

        role = get_user_role(user)
        if next_status == "closed" and role == ROLE_ADMIN:
            return None

        transitions = {
            "new": {"in_review"},
            "in_review": {"assigned"},
            "assigned": {"in_progress"},
            "in_progress": {"completed"},
            "completed": {"closed"},
            "closed": set(),
        }

        allowed = transitions.get(current_status, set())
        if next_status not in allowed:
            return {
                "message": f"Cannot transition from {current_status} to {next_status}.",
                "details": {"from": current_status, "to": next_status},
            }
        return None

    def _parse_datetime_param(self, value, *, is_end):
        parsed = parse_datetime(value)
        if parsed is None:
            parsed_date = parse_date(value)
            if parsed_date:
                if is_end:
                    parsed = datetime.combine(parsed_date, time.max)
                else:
                    parsed = datetime.combine(parsed_date, time.min)

        if parsed is None:
            return None

        if timezone.is_naive(parsed):
            return timezone.make_aware(parsed)
        return parsed

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'resident'):
            return Payment.objects.filter(resident=self.request.user.resident)
        return Payment.objects.none()

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.filter(is_active=True)
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated]

class AmenityBookingViewSet(viewsets.ModelViewSet):
    serializer_class = AmenityBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'resident'):
            return AmenityBooking.objects.filter(resident=self.request.user.resident)
        return AmenityBooking.objects.none()

class ParkingSpotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSpot.objects.all()
    serializer_class = ParkingSpotSerializer
    permission_classes = [IsAuthenticated]

class VisitorParkingViewSet(viewsets.ModelViewSet):
    serializer_class = VisitorParkingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'resident'):
            return VisitorParking.objects.filter(resident=self.request.user.resident)
        return VisitorParking.objects.none()

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.filter(is_active=True)
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.filter(is_active=True)
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]

class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.filter(is_active=True)
    serializer_class = ForumCommentSerializer
    permission_classes = [IsAuthenticated]

class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.filter(is_active=True)
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

class PackageViewSet(viewsets.ModelViewSet):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'staff'):
             return Package.objects.all().order_by('-arrival_date')
        if hasattr(user, 'resident'):
             return Package.objects.filter(recipient=user.resident).order_by('-arrival_date')
        return Package.objects.none()


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        
        user = authenticate(username=email, password=password)  # Now using email
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        
        return Response({"error": "Invalid credentials"}, status=400)
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.filter(is_active=True)
    serializer_class = PollSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Handle options
        poll = serializer.instance
        options_data = request.data.get('options_data', [])
        for opt_data in options_data:
            if opt_data.get('text'):
                PollOption.objects.create(poll=poll, text=opt_data['text'])
        
        # Re-serialize to include options
        serializer = self.get_serializer(poll)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # Ensure user is staff
        if hasattr(self.request.user, 'staff'):
            serializer.save(created_by=self.request.user.staff)
        else:
            # Fallback or error? For dev, assume first staff or create one?
            # Or just let it fail if not staff.
            # Ideally standard flow:
            serializer.save(created_by=Staff.objects.first()) # Temporary fallback for dev if auth mapping issues

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        poll = self.get_object()
        option_id = request.data.get('option_id')
        
        try:
            resident = request.user.resident
        except Resident.DoesNotExist:
            return Response({"error": "User is not a resident"}, status=status.HTTP_400_BAD_REQUEST)

        if PollVote.objects.filter(poll=poll, resident=resident).exists():
            return Response({"error": "You have already voted in this poll"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            option = PollOption.objects.get(id=option_id, poll=poll)
        except PollOption.DoesNotExist:
            return Response({"error": "Invalid option"}, status=status.HTTP_400_BAD_REQUEST)

        PollVote.objects.create(poll=poll, option=option, resident=resident)
        return Response({"message": "Vote recorded successfully"})

class IncidentReportViewSet(viewsets.ModelViewSet):
    serializer_class = IncidentReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'resident'):
            return IncidentReport.objects.filter(resident=user.resident)
        return IncidentReport.objects.all()

    def perform_create(self, serializer):
        resident = get_object_or_404(Resident, user=self.request.user)
        serializer.save(resident=resident)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


class HealthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = get_user_role(user)

        resident_data = None
        staff_data = None

        try:
            resident = user.resident
        except Resident.DoesNotExist:
            resident = None
        if resident:
            resident_data = ResidentProfileSerializer(resident).data

        try:
            staff = user.staff
        except Staff.DoesNotExist:
            staff = None
        if staff:
            staff_data = StaffProfileSerializer(staff).data

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": role,
                "resident": resident_data,
                "staff": staff_data,
            }
        )


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        announcements = Announcement.objects.filter(is_active=True)

        latest = announcements.order_by('-created_at')[:5]
        latest_payload = [
            {"id": item.id, "title": item.title, "created_at": item.created_at}
            for item in latest
        ]

        return Response(
            {
                "announcements": {
                    "active_count": announcements.count(),
                    "latest": latest_payload,
                }
            }
        )
