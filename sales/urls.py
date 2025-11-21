# from django.urls import path
# from .views import SaleListCreateView, SaleDetailView, SaleInvoiceView

# urlpatterns = [
#     path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
#     path('sales/<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
#     path('sales/<int:pk>/invoice/', SaleInvoiceView.as_view(), name='sale-invoice'),
# ]

from django.urls import path
from .views import (
    SaleListCreateView,
    SaleDetailView,
    SaleInvoiceView,
    CustomerListCreateView,   
    CustomerDetailView        
)

urlpatterns = [
    # Sales endpoints
    path('', SaleListCreateView.as_view(), name='sale-list-create'),
    path('<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('<int:pk>/invoice/', SaleInvoiceView.as_view(), name='sale-invoice'),

    # Customer endpoints
    path('customers/', CustomerListCreateView.as_view(), name='customer-list-create'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer-detail'),
]
