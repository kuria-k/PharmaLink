from django.utils import timezone
from django.db import models
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import PaymentRecord
from .serializers import PaymentRecordSerializer
from sales.models import Sale
from .mpesa import initiate_stk_push


class PaymentRecordListCreateView(generics.ListCreateAPIView):
    """
    List all payment records or create a new one.
    Supports filtering by status and date.
    """
    serializer_class = PaymentRecordSerializer

    def get_queryset(self):
        queryset = PaymentRecord.objects.select_related("sale").all()

        # Filter by status
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by date
        date_param = self.request.query_params.get("date")
        if date_param:
            queryset = queryset.filter(confirmed_at__date=date_param)

        return queryset


class STKPushSaleView(APIView):
    """
    Trigger an M-Pesa STK push for a given sale.
    Ensures a PaymentRecord exists and is marked pending.
    """
    def post(self, request, sale_id):
        try:
            sale = Sale.objects.get(id=sale_id)
        except Sale.DoesNotExist:
            return Response(
                {"error": "Sale not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        customer_phone = getattr(sale.customer, "phone", None)
        if not customer_phone:
            return Response(
                {"error": "Customer phone not available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call M-Pesa integration
        mpesa_response = initiate_stk_push(customer_phone, sale.total_amount)

        # Ensure a pending PaymentRecord exists
        record, _ = PaymentRecord.objects.get_or_create(sale=sale)
        record.payment_mode = "mpesa"
        record.status = "pending"
        record.save()

        serializer = PaymentRecordSerializer(record)
        return Response(
            {"mpesa_response": mpesa_response, "payment_record": serializer.data},
            status=status.HTTP_200_OK
        )


class ConfirmPaymentView(APIView):
    """
    Confirm a payment for a given sale.
    Updates both PaymentRecord and Sale with payment details.
    """
    def post(self, request, sale_id):
        try:
            sale = Sale.objects.get(id=sale_id)
        except Sale.DoesNotExist:
            return Response(
                {"error": "Sale not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        payment_mode = request.data.get("payment_mode", "cash")
        receipt = request.data.get("mpesa_receipt", "")
        status_value = request.data.get("status", "paid")
        amount_paid = request.data.get("amount_paid", sale.total_amount)

        # Update PaymentRecord
        record, _ = PaymentRecord.objects.get_or_create(sale=sale)
        record.payment_mode = payment_mode
        record.status = status_value
        record.amount_paid = amount_paid
        record.mpesa_receipt = receipt
        record.confirmed_by = (
            request.user.username if request.user.is_authenticated else "system"
        )
        record.confirmed_at = timezone.now()
        record.save()

        # Update Sale as well
        sale.payment_status = status_value
        sale.payment_method = payment_mode
        sale.confirmed_by = record.confirmed_by
        sale.confirmed_at = record.confirmed_at
        sale.save()

        serializer = PaymentRecordSerializer(record)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CashierDashboardView(APIView):
    """
    Dashboard view for cashier.
    Provides daily totals for sales and payments by mode.
    """
    def get(self, request):
        today = timezone.now().date()

        # Sales totals
        total_sales = (
            Sale.objects.filter(created_at__date=today)
            .aggregate(total_amount=models.Sum("total_amount"))["total_amount"]
            or 0
        )

        # Payment records
        pending_count = PaymentRecord.objects.filter(
            status="pending", sale__created_at__date=today
        ).count()

        confirmed_count = PaymentRecord.objects.filter(
            status="paid", sale__created_at__date=today
        ).count()

        mpesa_total = (
            PaymentRecord.objects.filter(
                payment_mode="mpesa", status="paid", sale__created_at__date=today
            ).aggregate(total=models.Sum("amount_paid"))["total"]
            or 0
        )

        cash_total = (
            PaymentRecord.objects.filter(
                payment_mode="cash", status="paid", sale__created_at__date=today
            ).aggregate(total=models.Sum("amount_paid"))["total"]
            or 0
        )

        card_total = (
            PaymentRecord.objects.filter(
                payment_mode="card", status="paid", sale__created_at__date=today
            ).aggregate(total=models.Sum("amount_paid"))["total"]
            or 0
        )

        return Response(
            {
                "total_sales": total_sales,
                "pending_payments": pending_count,
                "confirmed_payments": confirmed_count,
                "mpesa_total": mpesa_total,
                "cash_total": cash_total,
                "card_total": card_total,
            },
            status=status.HTTP_200_OK
        )



