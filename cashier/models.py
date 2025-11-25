# from django.db import models
# from sales.models import Sale

# class PaymentRecord(models.Model):
#     sale = models.OneToOneField(Sale, on_delete=models.CASCADE, related_name='payment_record')
#     payment_mode = models.CharField(max_length=50, choices=[
#         ('mpesa', 'M-Pesa'),
#         ('cash', 'Cash'),
#         ('card', 'Card'),
#         ('other', 'Other')
#     ])
#     status = models.CharField(max_length=20, choices=[
#         ('pending', 'Pending'),
#         ('paid', 'Paid'),
#         ('failed', 'Failed')
#     ], default='pending')
#     mpesa_receipt = models.CharField(max_length=100, blank=True, null=True)
#     confirmed_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.sale.invoice_number} - {self.status}"


from django.db import models
from decimal import Decimal
from sales.models import Sale

class PaymentRecord(models.Model):
    PAYMENT_MODES = [
        ('mpesa', 'M-Pesa'),
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('other', 'Other'),
    ]
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('partial', 'Partial'),
        ('reversed', 'Reversed'),
    ]

    sale = models.OneToOneField(Sale, on_delete=models.CASCADE, related_name='payment_record')
    payment_mode = models.CharField(max_length=50, choices=PAYMENT_MODES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    # M-Pesa specific fields
    mpesa_receipt = models.CharField(max_length=100, blank=True, null=True)
    mpesa_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_phone = models.CharField(max_length=20, blank=True, null=True)

    # Audit fields
    confirmed_by = models.CharField(max_length=100, blank=True, null=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.sale.invoice_number} - {self.status}"

