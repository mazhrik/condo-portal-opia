from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResidentViewSet, MaintenanceRequestViewSet, PaymentViewSet,
    AmenityViewSet, AmenityBookingViewSet, StaffViewSet,
    WeatherStationViewSet, LocalBusinessViewSet
)

router = DefaultRouter()
router.register(r'residents', ResidentViewSet)
router.register(r'maintenance-requests', MaintenanceRequestViewSet, basename='maintenance-request')
router.register(r'payments', PaymentViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'amenity-bookings', AmenityBookingViewSet, basename='amenity-booking')
router.register(r'staff', StaffViewSet)
router.register(r'weather', WeatherStationViewSet)
router.register(r'local-businesses', LocalBusinessViewSet)

urlpatterns = [
    path('', include(router.urls)),
]