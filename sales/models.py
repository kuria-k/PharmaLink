from django.db import models
from inventory.models import Product
from datetime import datetime

class Sale(models.Model):
    customer_name = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            year_suffix = datetime.now().strftime('%y') 
            prefix = f"CS0{year_suffix}"
            count = Sale.objects.filter(timestamp__year=datetime.now().year).count() + 1
            sequence = str(count).zfill(7)
            self.invoice_number = f"{prefix}{sequence}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

