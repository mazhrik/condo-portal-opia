from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Amenity,
    AmenityBooking,
    Announcement,
    Document,
    EmergencyContact,
    ForumComment,
    ForumPost,
    MaintenanceRequest,
    ParkingSpot,
    Payment,
    Resident,
    Staff,
    VisitorParking,
)
from .permissions import IsAdmin, IsAdminOrManager
from .roles import get_user_role
from .serializers import (
    AmenityBookingSerializer,
    AmenitySerializer,
    AnnouncementSerializer,
    DocumentSerializer,
    EmergencyContactSerializer,
    ForumCommentSerializer,
    ForumPostSerializer,
    MaintenanceRequestSerializer,
    MeSerializer,
    ParkingSpotSerializer,
    PaymentSerializer,
    ResidentSerializer,
    StaffSerializer,
    VisitorParkingSerializer,
)

class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAdminOrManager]

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'staff'):
            return MaintenanceRequest.objects.all().order_by('-created_at')
        elif hasattr(user, 'resident'):
            return MaintenanceRequest.objects.filter(resident=user.resident).order_by('-created_at')
        return MaintenanceRequest.objects.none()

    def perform_create(self, serializer):
        resident = get_object_or_404(Resident, user=self.request.user)
        serializer.save(resident=resident)

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
    permission_classes = [IsAdmin]


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payload = {"user": request.user, "role": get_user_role(request.user)}
        serializer = MeSerializer(payload)
        return Response(serializer.data)

