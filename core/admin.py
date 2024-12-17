from django.contrib import admin
from .models import Resident, MaintenanceRequest, Payment, Amenity, AmenityBooking, Staff

admin.site.register(Resident)
admin.site.register(MaintenanceRequest)
admin.site.register(Payment)
admin.site.register(Amenity)
admin.site.register(AmenityBooking)
admin.site.register(Staff)