# from django.urls import path
# from .views import (  BranchListCreateView, BranchDetailView, UserListCreateView, UserProfileListCreateView, UserProfileDetailView, ChangePasswordView)

# urlpatterns = [
    # path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    # path('branches/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),
    # path('users/', UserListCreateView.as_view(), name='user-list-create'),
    # path('profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
    # path('profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),
    # path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    # path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
#     path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
#     path('branches/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),
#     path('profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
#     path('profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),
# ]

# urlpatterns = [
#     path('api/branches/', BranchListCreateView.as_view(), name='branch-list-create'),
#     path('api/branches/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),
#     path('api/users/', UserListCreateView.as_view(), name='user-list-create'),
#     path('api/profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
#     path('api/profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),
#     path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
#     path('api/admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
# ]


from django.urls import path
from .views import (
    BranchListCreateView,
    BranchDetailView,
    UserListCreateView,
    UserProfileListCreateView,
    UserProfileDetailView,
    ChangePasswordView,
    ProductListCreateView,
    ProductDetailView,
    SaleListCreateView,
    SaleDetailView,
)

urlpatterns = [
    # Branch endpoints
    path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),

    # User endpoints
    path('users/', UserListCreateView.as_view(), name='user-list-create'),

    # UserProfile endpoints
    path('profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
    path('profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),

    # Products endpoints
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Sales endpoints
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),

    # Change password
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
