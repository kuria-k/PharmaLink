from django.db import models
from inventory.models import Product
from datetime import datetime
from decimal import Decimal


class Branch(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class Sale(models.Model):
    customer_name = models.CharField(max_length=255)
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="sales", null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            year_suffix = datetime.now().strftime('%y')
            prefix = f"CS0{year_suffix}"
            count = Sale.objects.filter(created_at__year=datetime.now().year).count() + 1
            sequence = str(count).zfill(7)
            self.invoice_number = f"{prefix}{sequence}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"


class SaleItem(models.Model):
    UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    vat = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))      
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))  

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"


class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    address = models.TextField(blank=True, null=True)
    total_sales = models.IntegerField(default=0)

    def __str__(self):
        return self.name



