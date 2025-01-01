from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResidentViewSet, MaintenanceRequestViewSet, PaymentViewSet,
    AmenityViewSet, AmenityBookingViewSet, ParkingSpotViewSet,
    VisitorParkingViewSet, DocumentViewSet, ForumPostViewSet,
    ForumCommentViewSet, EmergencyContactViewSet, StaffViewSet,
    AnnouncementViewSet
)

router = DefaultRouter()
router.register(r'residents', ResidentViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'maintenance-requests', MaintenanceRequestViewSet, basename='maintenance-request')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'amenities', AmenityViewSet)
router.register(r'amenity-bookings', AmenityBookingViewSet, basename='amenity-booking')
router.register(r'parking-spots', ParkingSpotViewSet)
router.register(r'visitor-parking', VisitorParkingViewSet, basename='visitor-parking')
router.register(r'documents', DocumentViewSet)
router.register(r'forum-posts', ForumPostViewSet)
router.register(r'forum-comments', ForumCommentViewSet)
router.register(r'emergency-contacts', EmergencyContactViewSet)
router.register(r'staff', StaffViewSet)

urlpatterns = [
    path('', include(router.urls)),
]