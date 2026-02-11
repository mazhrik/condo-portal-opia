from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Package, Announcement, MaintenanceRequest, Notification, ArchitecturalRequest, Violation

@receiver(post_save, sender=Package)
def create_package_notification(sender, instance, created, **kwargs):
    if created and instance.recipient:
        Notification.objects.create(
            user=instance.recipient.user,
            type='package',
            message=f"You have a new package from {instance.courier}. Tracking: {instance.tracking_number or 'N/A'}",
            related_object_id=instance.id
        )

@receiver(post_save, sender=Announcement)
def create_announcement_notification(sender, instance, created, **kwargs):
    if created and instance.is_active:
        # Notify all residents
        # Note: In a real large-scale app, this should be a background task (Celery)
        residents = User.objects.filter(resident__isnull=False)
        notifications = [
            Notification(
                user=user,
                type='announcement',
                message=f"New Announcement: {instance.title}",
                related_object_id=instance.id
            )
            for user in residents
        ]
        Notification.objects.bulk_create(notifications)

@receiver(post_save, sender=MaintenanceRequest)
def create_maintenance_notification(sender, instance, created, **kwargs):
    # Notify resident when status changes (simplified check using previous state would require tracking)
    # For now, we notify on creation (to functionality confirmation?) or basic updates if we tracked dirty fields.
    # Let's assume this signal runs on update mostly for status changes if we tracked it, 
    # but for simplicity in Phase 4, let's just notify the resident if it's resolved.
    
    if instance.status == 'completed':
        Notification.objects.create(
            user=instance.resident.user,
            type='maintenance',
            message=f"Your maintenance request '{instance.title}' has been completed.",
            related_object_id=instance.id
        )
    
    # Notify staff if new request created
    if created:
        staff_users = User.objects.filter(staff__isnull=False)
        notifications = [
            Notification(
                user=user,
                type='maintenance',
                message=f"New Maintenance Request from Unit {instance.resident.unit_number}: {instance.title}",
                related_object_id=instance.id
            )
            for user in staff_users
        ]
        Notification.objects.bulk_create(notifications)


@receiver(post_save, sender=ArchitecturalRequest)
def create_arc_notification(sender, instance, created, **kwargs):
    if not created:
        Notification.objects.create(
            user=instance.resident.user,
            type='general', 
            message=f"Update on your ARC Request '{instance.title}': Status is now {instance.status}",
            related_object_id=instance.id
        )

@receiver(post_save, sender=Violation)
def create_violation_notification(sender, instance, created, **kwargs):
    if created:
         Notification.objects.create(
            user=instance.resident.user,
            type='general', 
            message=f"A violation has been logged for your unit: {instance.description}. Fine: ${instance.fine_amount}",
            related_object_id=instance.id
        )
