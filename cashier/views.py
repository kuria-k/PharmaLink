from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PaymentRecord
from .serializers import PaymentRecordSerializer
from sales.models import Sale
from .mpesa import initiate_stk_push

class PaymentRecordListCreateView(generics.ListCreateAPIView):
    queryset = PaymentRecord.objects.all()
    serializer_class = PaymentRecordSerializer

class STKPushSaleView(APIView):
    def post(self, request, sale_id):
        try:
            sale = Sale.objects.get(id=sale_id)
            response = initiate_stk_push(sale.customer_phone, sale.total_amount)
            return Response({'mpesa_response': response})
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

class ConfirmPaymentView(APIView):
    def post(self, request, sale_id):
        try:
            sale = Sale.objects.get(id=sale_id)
            payment_mode = request.data.get('payment_mode')
            receipt = request.data.get('mpesa_receipt', '')
            record, created = PaymentRecord.objects.get_or_create(sale=sale)
            record.payment_mode = payment_mode
            record.status = 'paid'
            record.mpesa_receipt = receipt
            record.save()
            return Response({'status': 'Payment confirmed'})
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

