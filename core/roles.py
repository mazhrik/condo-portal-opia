ROLE_ADMIN = "Admin"
ROLE_PROPERTY_MANAGER = "Property Manager"
ROLE_RESIDENT = "Resident"


def get_user_role(user):
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser:
        return ROLE_ADMIN
    if hasattr(user, "staff"):
        return ROLE_PROPERTY_MANAGER
    return ROLE_RESIDENT
