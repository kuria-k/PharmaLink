from rest_framework import serializers
from .models import PaymentRecord
from sales.models import Sale


class SaleSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for sale details inside payment record."""
    class Meta:
        model = Sale
        fields = ['id', 'invoice_number', 'customer_name', 'total_amount']


class PaymentRecordSerializer(serializers.ModelSerializer):
    # Nested sale summary for quick access
    sale = SaleSummarySerializer(read_only=True)

    # Expose cashier audit fields
    confirmed_by = serializers.CharField(read_only=True)
    confirmed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = PaymentRecord
        fields = [
            'id',
            'sale',
            'payment_mode',
            'status',
            'amount_paid',
            'mpesa_receipt',
            'mpesa_transaction_id',
            'mpesa_phone',
            'confirmed_by',
            'confirmed_at',
        ]

    # Validation for payment mode
    def validate_payment_mode(self, value):
        valid_modes = ['mpesa', 'cash', 'card', 'other']
        if value not in valid_modes:
            raise serializers.ValidationError("Invalid payment mode.")
        return value

    # Validation for status
    def validate_status(self, value):
        valid_statuses = ['pending', 'paid', 'failed', 'partial', 'reversed']
        if value not in valid_statuses:
            raise serializers.ValidationError("Invalid payment status.")
        return value

    # Optional: ensure amount_paid is not negative
    def validate_amount_paid(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount paid cannot be negative.")
        return value

