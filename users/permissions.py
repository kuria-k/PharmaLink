# from rest_framework.permissions import BasePermission

# class IsAdmin(BasePermission):
#     def has_permission(self, request, view):
#         # If role is stored in UserProfile:
#         return hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'admin'
#         # Or if role is directly on User:
#         # return request.user.role == 'admin'
