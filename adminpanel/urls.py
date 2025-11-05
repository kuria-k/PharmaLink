from django.urls import path
from .views import ( BranchListCreateView, UserListCreateView, UserProfileListCreateView, UserProfileDetailView, ChangePasswordView)

urlpatterns = [
    path('api/branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    path('api/users/', UserListCreateView.as_view(), name='user-list-create'),
    path('api/profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
    path('api/profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
