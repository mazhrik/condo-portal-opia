from rest_framework.permissions import BasePermission
from .roles import ROLE_ADMIN, ROLE_PROPERTY_MANAGER, ROLE_RESIDENT, get_user_role


class IsAdminOrManager(BasePermission):
    """
    Permission class that allows access only to admin or property manager users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role = get_user_role(request.user)
        return role in (ROLE_ADMIN, ROLE_PROPERTY_MANAGER)


class IsResident(BasePermission):
    """
    Permission class that allows access only to resident users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role = get_user_role(request.user)
        return role == ROLE_RESIDENT


class IsStaffUser(BasePermission):
    """
    Permission class that allows access only to staff users (admin, property manager, or staff).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'staff') or request.user.is_staff or request.user.is_superuser


class IsResidentOrStaff(BasePermission):
    """
    Permission class that allows access to both residents and staff.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'resident') or hasattr(request.user, 'staff') or request.user.is_staff

class IsBoardMember(BasePermission):
    """
    Permission class that allows access only to board members.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Board members are typically residents with the flag
        is_board = False
        if hasattr(request.user, 'resident'):
             is_board = request.user.resident.is_board_member
        
        # Staff/Admins also get access usually (to manage board stuff)
        is_staff = hasattr(request.user, 'staff') or request.user.is_staff or request.user.is_superuser
        
        return is_board or is_staff
