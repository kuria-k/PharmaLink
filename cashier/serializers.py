from rest_framework import serializers
from .models import PaymentRecord
from sales.models import Sale

class PaymentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = ['id', 'sale', 'payment_mode', 'status', 'mpesa_receipt', 'confirmed_at']
