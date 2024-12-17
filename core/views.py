from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Resident, MaintenanceRequest, Payment, Amenity, 
    AmenityBooking, Staff, WeatherStation, LocalBusiness
)
from .serializers import (
    ResidentSerializer, MaintenanceRequestSerializer, PaymentSerializer,
    AmenitySerializer, AmenityBookingSerializer, StaffSerializer,
    WeatherStationSerializer, LocalBusinessSerializer
)

# ... keep existing code (ResidentViewSet, MaintenanceRequestViewSet, etc.)

class WeatherStationViewSet(viewsets.ModelViewSet):
    queryset = WeatherStation.objects.all()
    serializer_class = WeatherStationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def current_conditions(self, request):
        latest_weather = WeatherStation.objects.latest('last_updated')
        serializer = self.get_serializer(latest_weather)
        return Response(serializer.data)

class LocalBusinessViewSet(viewsets.ModelViewSet):
    queryset = LocalBusiness.objects.all()
    serializer_class = LocalBusinessSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = request.query_params.get('latitude')
        lng = request.query_params.get('longitude')
        business_type = request.query_params.get('type')
        
        queryset = self.get_queryset()
        if business_type:
            queryset = queryset.filter(business_type=business_type)
            
        # In a real application, we would use PostGIS for proper geo-queries
        # This is a simplified version
        queryset = queryset.order_by('name')[:10]
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)