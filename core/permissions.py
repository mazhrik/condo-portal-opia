from rest_framework.permissions import BasePermission

from .roles import ROLE_ADMIN, ROLE_PROPERTY_MANAGER, ROLE_RESIDENT, get_user_role


class RolePermission(BasePermission):
    allowed_roles = ()

    def has_permission(self, request, view):
        role = get_user_role(request.user)
        return role in self.allowed_roles


class IsAdmin(RolePermission):
    allowed_roles = (ROLE_ADMIN,)


class IsPropertyManager(RolePermission):
    allowed_roles = (ROLE_PROPERTY_MANAGER,)


class IsResident(RolePermission):
    allowed_roles = (ROLE_RESIDENT,)


class IsAdminOrManager(RolePermission):
    allowed_roles = (ROLE_ADMIN, ROLE_PROPERTY_MANAGER)
