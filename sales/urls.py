from django.urls import path
from .views import SaleListCreateView, SaleDetailView, SaleInvoiceView

urlpatterns = [
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('sales/<int:pk>/invoice/', SaleInvoiceView.as_view(), name='sale-invoice'),
]
