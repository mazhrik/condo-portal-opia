from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Package, Announcement, MaintenanceRequest, Notification, ArchitecturalRequest, Violation
from django.contrib.contenttypes.models import ContentType

@receiver(post_save, sender=Package)
def create_package_notification(sender, instance, created, **kwargs):
    if created and instance.recipient:
        Notification.objects.create(
            user=instance.recipient.user,
            type='package',
            message=f"You have a new package from {instance.courier}. Tracking: {instance.tracking_number or 'N/A'}",
            content_object=instance
        )

@receiver(post_save, sender=Announcement)
def create_announcement_notification(sender, instance, created, **kwargs):
    if created and instance.is_active:
        residents = User.objects.filter(resident__isnull=False)
        content_type = ContentType.objects.get_for_model(instance.__class__)
        notifications = [
            Notification(
                user=user,
                type='announcement',
                message=f"New Announcement: {instance.title}",
                content_type=content_type,
                object_id=instance.id
            )
            for user in residents
        ]
        Notification.objects.bulk_create(notifications)

@receiver(post_save, sender=MaintenanceRequest)
def create_maintenance_notification(sender, instance, created, **kwargs):
    if instance.status == 'completed':
        Notification.objects.create(
            user=instance.resident.user,
            type='maintenance',
            message=f"Your maintenance request '{instance.title}' has been completed.",
            content_object=instance
        )
    
    if created:
        staff_users = User.objects.filter(staff__isnull=False)
        content_type = ContentType.objects.get_for_model(instance.__class__)
        notifications = [
            Notification(
                user=user,
                type='maintenance',
                message=f"New Maintenance Request from Unit {instance.resident.unit_number}: {instance.title}",
                content_type=content_type,
                object_id=instance.id
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
            content_object=instance
        )

@receiver(post_save, sender=Violation)
def create_violation_notification(sender, instance, created, **kwargs):
    if created:
         Notification.objects.create(
            user=instance.resident.user,
            type='general', 
            message=f"A violation has been logged for your unit: {instance.description}. Fine: ${instance.fine_amount}",
            content_object=instance
        )
