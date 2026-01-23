ROLE_ADMIN = "admin"
ROLE_PROPERTY_MANAGER = "manager"
ROLE_RESIDENT = "resident"


def get_user_role(user):
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser or user.is_staff:
        return ROLE_ADMIN
    if hasattr(user, "staff"):
        return ROLE_PROPERTY_MANAGER
    if hasattr(user, "resident"):
        return ROLE_RESIDENT
    return None
