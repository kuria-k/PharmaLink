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
    UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Calculate price per unit
        if self.unit == 'p':
            self.price = self.product.price_per_piece()
            units_to_deduct = self.quantity
        else:
            self.price = self.product.price
            units_to_deduct = self.quantity * self.product.pieces_per_pack

        # Deduct from inventory
        if self.product.quantity < units_to_deduct:
            raise ValueError("Insufficient stock for this sale.")
        self.product.quantity -= units_to_deduct
        self.product.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"


