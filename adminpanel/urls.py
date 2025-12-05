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


# from django.urls import path
# from .views import (
#     BranchListCreateView,
#     BranchDetailView,
#     UserListCreateView,
#     UserProfileListCreateView,
#     UserProfileDetailView,
#     ChangePasswordView,
#     ProductListCreateView,
#     ProductDetailView,
#     # SaleListCreateView,
#     # SaleDetailView,
#     login_view
# )

# urlpatterns = [
#      path("api/login/", login_view, name="login"),

#     # Branch endpoints
#     path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
#     path('branches/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),

#     # User endpoints
#     path('users/', UserListCreateView.as_view(), name='user-list-create'),

#     # UserProfile endpoints
#     path('profiles/', UserProfileListCreateView.as_view(), name='profile-list-create'),
#     path('profiles/<int:pk>/', UserProfileDetailView.as_view(), name='profile-detail'),

#     # Products endpoints
#     path('products/', ProductListCreateView.as_view(), name='product-list-create'),
#     path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

#     # Sales endpoints
#     # path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
#     # path('sales/<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),

#     # Change password
#     path('change-password/', ChangePasswordView.as_view(), name='change-password'),
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
    FirstLoginChangePasswordView,
    ResetPasswordRequestView,
    login_view
)

urlpatterns = [
    # Login
    path("login/", login_view, name="login"),

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

    # Change password
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('first-login-change-password/', FirstLoginChangePasswordView.as_view(), name='first-login-change-password'),
    path('reset-password-request/', ResetPasswordRequestView.as_view(), name='reset-password-request'),
]
