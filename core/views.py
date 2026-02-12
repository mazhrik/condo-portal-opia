from rest_framework import viewsets, status
import stripe
import os
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from datetime import datetime, time
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate, get_user_model

from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement, Package, Poll, PollOption, PollVote,
    IncidentReport, Event, Notification, ArchitecturalRequest, Violation
)

from .serializers import (
    ResidentSerializer, MaintenanceRequestSerializer, PaymentSerializer,
    AmenitySerializer, AmenityBookingSerializer, ParkingSpotSerializer,
    VisitorParkingSerializer, DocumentSerializer, ForumPostSerializer,
    ForumCommentSerializer, EmergencyContactSerializer, StaffSerializer,
    AnnouncementSerializer, PackageSerializer, PollSerializer,
    PollOptionSerializer, PollVoteSerializer, IncidentReportSerializer,
    EventSerializer, ResidentProfileSerializer, StaffProfileSerializer,
    MaintenanceRequestUpdateSerializer, NotificationSerializer,
    ArchitecturalRequestSerializer, ViolationSerializer, ResidentCreateSerializer
)
from .permissions import IsAdminOrManager, IsResident, IsStaffUser, IsResidentOrStaff, IsBoardMember
from .pagination import AnnouncementPagination, MaintenanceRequestPagination, GenericPagination
from .roles import ROLE_ADMIN, ROLE_PROPERTY_MANAGER, ROLE_RESIDENT, get_user_role


class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]
    pagination_class = GenericPagination

    def get_serializer_class(self):
        if self.action == 'create':
            return ResidentCreateSerializer
        return ResidentSerializer

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
        user = self.request.user
        # Allow staff/admin to see all payments
        if hasattr(user, 'staff') or user.is_staff or user.is_superuser:
            return Payment.objects.all().order_by('-date')
            
        if hasattr(user, 'resident'):
            return Payment.objects.filter(resident=user.resident).order_by('-date')
        return Payment.objects.none()

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.filter(is_active=True)
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated]

class AmenityBookingViewSet(viewsets.ModelViewSet):
    serializer_class = AmenityBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'staff') or user.is_staff or user.is_superuser:
            return AmenityBooking.objects.all().order_by('-start_time')

        if hasattr(user, 'resident'):
            return AmenityBooking.objects.filter(resident=user.resident).order_by('-start_time')
        return AmenityBooking.objects.none()

class ParkingSpotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSpot.objects.all()
    serializer_class = ParkingSpotSerializer
    permission_classes = [IsAuthenticated]

class VisitorParkingViewSet(viewsets.ModelViewSet):
    serializer_class = VisitorParkingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'staff') or user.is_staff or user.is_superuser:
            return VisitorParking.objects.all().order_by('-visit_date')

        if hasattr(self.request.user, 'resident'):
            return VisitorParking.objects.filter(resident=self.request.user.resident).order_by('-visit_date')
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
            raise PermissionDenied("Only staff members can create polls.")

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
        
        # Return updated poll data with vote counts
        serializer = self.get_serializer(poll)
        return Response({
            "message": "Vote recorded successfully",
            "poll": serializer.data
        })


class IncidentReportViewSet(viewsets.ModelViewSet):
    serializer_class = IncidentReportSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ('update', 'partial_update'):
            return [IsAuthenticated(), IsStaffUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        role = get_user_role(user)
        if role in (ROLE_ADMIN, ROLE_PROPERTY_MANAGER) or hasattr(user, 'staff'):
            return IncidentReport.objects.all().order_by('-created_at')
        if hasattr(user, 'resident'):
            return IncidentReport.objects.filter(resident=user.resident).order_by('-created_at')
        return IncidentReport.objects.none()

    def perform_create(self, serializer):
        resident = get_object_or_404(Resident, user=self.request.user)
        serializer.save(resident=resident)

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsStaffUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Event.objects.filter(is_active=True).order_by('date')
        
        # Filter for upcoming events
        upcoming = self.request.query_params.get('upcoming')
        if upcoming and upcoming.lower() in ('true', '1', 'yes'):
            queryset = queryset.filter(date__gte=timezone.now())
        
        return queryset

    def perform_create(self, serializer):
        staff = get_object_or_404(Staff, user=self.request.user)
        serializer.save(created_by=staff)


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


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user).order_by('-created_at')
        unread = self.request.query_params.get('unread')
        if unread and unread.lower() in ('true', '1', 'yes'):
            queryset = queryset.filter(is_read=False)
        return queryset

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})


class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
            if not stripe.api_key:
                 return Response({"error": "Stripe not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            amount = request.data.get('amount')
            currency = request.data.get('currency', 'usd')

            if not amount:
                return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),  # Convert to cents
                currency=currency,
                metadata={'user_id': request.user.id}
            )
            return Response({'clientSecret': intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def send_receipt_email(payment):
    # This is a placeholder. In a real application, you would use a transactional email service.
    print(f"Sending receipt for payment {payment.id} to {payment.resident.user.email}")

class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

        if not endpoint_secret:
            return Response({"error": "Webhook secret not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return Response(status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response(status=400)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            user_id = payment_intent['metadata'].get('user_id')
            User = get_user_model()
            try:
                user = User.objects.get(id=.venv/bin/activate && python3 manage.py makemigrations && python3 manage.py migrateuser_id)
                resident = get_object_or_404(Resident, user=user)
                
                payment = Payment.objects.create(
                    resident=resident,
                    amount=payment_intent['amount'] / 100.0,
                    date=timezone.now(),
                    payment_method='stripe',
                    status='completed',
                    transaction_id=payment_intent['id']
                )
                send_receipt_email(payment)

            except User.DoesNotExist:
                print(f"User with ID {user_id} not found.")
            except Resident.DoesNotExist:
                print(f"Resident for user with ID {user_id} not found.")
            except Exception as e:
                print(f"Error processing payment: {e}")
        else:
            print('Unhandled event type {}'.format(event['type']))

        return Response(status=200)

class ArchitecturalRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ArchitecturalRequestSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GenericPagination

    def get_queryset(self):
        user = self.request.user
        # Staff and Board see all
        if hasattr(user, 'staff') or (hasattr(user, 'resident') and user.resident.is_board_member):
            return ArchitecturalRequest.objects.all().order_by('-submitted_at')
        # Residents see their own
        if hasattr(user, 'resident'):
            return ArchitecturalRequest.objects.filter(resident=user.resident).order_by('-submitted_at')
        return ArchitecturalRequest.objects.none()

    def perform_create(self, serializer):
        resident = get_object_or_404(Resident, user=self.request.user)
        serializer.save(resident=resident)

    @action(detail=True, methods=['post', 'patch'], url_path='status', permission_classes=[IsAuthenticated, IsBoardMember])
    def update_status(self, request, pk=None):
        arc = self.get_object()
        status_val = request.data.get('status')
        if status_val not in ['approved', 'denied']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        arc.status = status_val
        arc.reviewed_at = timezone.now()
        if hasattr(request.user, 'staff'):
             arc.reviewed_by = request.user.staff
        arc.board_comments = request.data.get('comment', '') or request.data.get('board_comments', '')
        arc.save()
        return Response({'status': status_val})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsBoardMember])
    def approve(self, request, pk=None):
        return self.update_status(request, pk)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsBoardMember])
    def deny(self, request, pk=None):
        return self.update_status(request, pk)


class ViolationViewSet(viewsets.ModelViewSet):
    serializer_class = ViolationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = GenericPagination

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsStaffUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        queryset = Violation.objects.all().order_by('-logged_at')
        
        # Filtering
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        resident_id = self.request.query_params.get('resident_id')
        if resident_id:
            queryset = queryset.filter(resident_id=resident_id)
            
        # Access control
        if hasattr(user, 'staff') or (hasattr(user, 'resident') and user.resident.is_board_member):
            return queryset
        if hasattr(user, 'resident'):
            return queryset.filter(resident=user.resident)
        return Violation.objects.none()

    def perform_create(self, serializer):
        staff = get_object_or_404(Staff, user=self.request.user)
        serializer.save(logged_by=staff)

    @action(detail=False, methods=['get'])
    def my(self, request):
        if not hasattr(request.user, 'resident'):
            return Response({'error': 'Not a resident'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset().filter(resident=request.user.resident)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class BoardFinancialReportView(APIView):
    permission_classes = [IsAuthenticated, IsBoardMember]

    def get(self, request):
        # Mock financial data for now
        return Response({
            "total_revenue": 150000.00,
            "total_expenses": 45000.00,
            "reserve_fund": 500000.00,
            "outstanding_dues": 12000.00,
            "last_updated": timezone.now()
        })

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "http://localhost:5173" # Setup as env var in production
