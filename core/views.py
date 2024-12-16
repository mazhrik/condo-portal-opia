from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking, Staff
from .serializers import (
    ResidentSerializer, MaintenanceRequestSerializer, PaymentSerializer,
    AmenitySerializer, AmenityBookingSerializer, StaffSerializer
)

class ResidentViewSet(viewsets.ModelViewSet):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAdminUser]

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return MaintenanceRequest.objects.all()
        return MaintenanceRequest.objects.filter(resident__user=self.request.user)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsAuthenticated]

class AmenityBookingViewSet(viewsets.ModelViewSet):
    serializer_class = AmenityBookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return AmenityBooking.objects.all()
        return AmenityBooking.objects.filter(resident__user=self.request.user)

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAdminUser]