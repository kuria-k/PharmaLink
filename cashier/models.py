from django.db import models
from sales.models import Sale

class PaymentRecord(models.Model):
    sale = models.OneToOneField(Sale, on_delete=models.CASCADE, related_name='payment_record')
    payment_mode = models.CharField(max_length=50, choices=[
        ('mpesa', 'M-Pesa'),
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('other', 'Other')
    ])
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ], default='pending')
    mpesa_receipt = models.CharField(max_length=100, blank=True, null=True)
    confirmed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sale.invoice_number} - {self.status}"

