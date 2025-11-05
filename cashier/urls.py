from django.urls import path
from .views import PaymentRecordListCreateView, STKPushSaleView, ConfirmPaymentView

urlpatterns = [
    path('payments/', PaymentRecordListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:sale_id>/stkpush/', STKPushSaleView.as_view(), name='payment-stkpush'),
    path('payments/<int:sale_id>/confirm/', ConfirmPaymentView.as_view(), name='payment-confirm'),
]
