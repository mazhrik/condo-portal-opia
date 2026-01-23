
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AmenityBookingViewSet,
    AmenityViewSet,
    AnnouncementViewSet,
    CustomTokenObtainPairView,
    DocumentViewSet,
    EmergencyContactViewSet,
    ForumCommentViewSet,
    ForumPostViewSet,
    HealthCheckView,
    MaintenanceRequestViewSet,
    MeView,
    ParkingSpotViewSet,
    PaymentViewSet,
    ResidentViewSet,
    StaffViewSet,
    VisitorParkingViewSet,
)


router = DefaultRouter()
router.register(r'residents', ResidentViewSet)
router.register(r'maintenance-requests', MaintenanceRequestViewSet, basename='maintenance-request')
router.register(r'announcements', AnnouncementViewSet)
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
    path('health/', HealthCheckView.as_view(), name='health'),
    path('me/', MeView.as_view(), name='me'),
    path('auth/', include('dj_rest_auth.urls')),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),  # Include your API endpoints
]
