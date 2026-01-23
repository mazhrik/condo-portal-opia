from rest_framework.pagination import PageNumberPagination


class AnnouncementPagination(PageNumberPagination):
    page_size = 20


class MaintenanceRequestPagination(PageNumberPagination):
    page_size = 20
