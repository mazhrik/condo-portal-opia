from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResidentViewSet, MaintenanceRequestViewSet, PaymentViewSet,
    AmenityViewSet, AmenityBookingViewSet, ParkingSpotViewSet,
    VisitorParkingViewSet, DocumentViewSet, ForumPostViewSet,
    ForumCommentViewSet, EmergencyContactViewSet, StaffViewSet,
    AnnouncementViewSet, PackageViewSet, PollViewSet, IncidentReportViewSet,
    EventViewSet, HealthView, MeView, DashboardSummaryView
)

from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


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
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'polls', PollViewSet)
router.register(r'incidents', IncidentReportViewSet, basename='incident-report')
router.register(r'events', EventViewSet)

urlpatterns = [
    path('health', HealthView.as_view(), name='health'),
    path('health/', HealthView.as_view(), name='health_slash'),
    path('me', MeView.as_view(), name='me'),
    path('me/', MeView.as_view(), name='me_slash'),
    path('dashboard/summary', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary-slash'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),  # Include your API endpoints
]
