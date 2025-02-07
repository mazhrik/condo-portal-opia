from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import MaintenanceRequest, Resident
from .serializers import MaintenanceRequestSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate

from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking,
    ParkingSpot, VisitorParking, Document, ForumPost, ForumComment,
    EmergencyContact, Staff, Announcement
)
from .serializers import (
    ResidentSerializer, MaintenanceRequestSerializer, PaymentSerializer,
    AmenitySerializer, AmenityBookingSerializer, ParkingSpotSerializer,
    VisitorParkingSerializer, DocumentSerializer, ForumPostSerializer,
    ForumCommentSerializer, EmergencyContactSerializer, StaffSerializer,
    AnnouncementSerializer
)

class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAuthenticated]

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

from rest_framework import status

@action(detail=True, methods=['post'])
def update_status(self, request, pk=None):
    maintenance_request = self.get_object()
    status_value = request.data.get('status')

    if status_value in dict(MaintenanceRequest.STATUS_CHOICES):
        maintenance_request.status = status_value
        maintenance_request.save()
        serializer = self.get_serializer(maintenance_request)
        return Response(serializer.data)

    return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST) 

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
