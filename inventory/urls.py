from django.urls import path
from . import views
from .views import InventorySummaryView, BatchListCreateView, BatchDetailView,PurchaseOrderListCreateView, PurchaseOrderDetailView, BatchFromCompletedView, SupplierDetailView, SupplierListCreateView, ProductValuationView, AddOrUpdateProductView
from .views import AddOrUpdateProductView


urlpatterns = [
    path('products/', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('summary/', InventorySummaryView.as_view(), name='inventory-summary'),  
    # path("batches/", BatchListCreateView.as_view(), name="batch-list"),
    # path("batches/<int:pk>/", BatchDetailView.as_view(), name="batch-detail"),
    path('purchase-orders/', PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('purchase-orders/<int:pk>/', PurchaseOrderDetailView.as_view(), name='purchase-order-detail'),
    path("batches/", BatchListCreateView.as_view(), name="batch-list-create"),
    path("batches/<int:pk>/", BatchDetailView.as_view(), name="batch-detail"),
    path("batches/from-completed/", BatchFromCompletedView.as_view(), name="batch-from-completed"),
    path("suppliers/", SupplierListCreateView.as_view(), name="supplier-list-create"),
    path("suppliers/<int:pk>/", SupplierDetailView.as_view(), name="supplier-detail"),
    path("products/valuation/", ProductValuationView.as_view(), name="product-valuation"),
    # path("products/add-or-update/", AddOrUpdateProductView.as_view(), name="add_or_update_product"),
    path("products/upsert/", AddOrUpdateProductView.as_view(), name="product-upsert"),
]




