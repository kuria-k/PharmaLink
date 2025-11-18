import uuid
from django.db import models

# Utility functions for auto-generated numbers
def generate_batch_no():
    return f"BAT-{uuid.uuid4().hex[:8].upper()}"

def generate_po_number():
    return f"PO-{uuid.uuid4().hex[:6].upper()}"


class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)

    # Pricing
    price_per_pack = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_piece = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    selling_price_per_pack = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price_per_piece = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Unit breakdown
    unit_type = models.CharField(
        max_length=10,
        choices=[("pack", "Pack"), ("piece", "Piece")],
        default="pack"
    )
    pieces_per_pack = models.PositiveIntegerField(default=1)

    # Inventory control
    reorder_level = models.PositiveIntegerField(default=0)
    daily_usage = models.PositiveIntegerField(default=5)
    lead_time = models.PositiveIntegerField(default=10)
    safety_stock = models.PositiveIntegerField(default=10)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # auto-calculate reorder level before saving
        self.reorder_level = (self.daily_usage * self.lead_time) + self.safety_stock
        super().save(*args, **kwargs)

    def get_piece_price(self):
        if self.price_per_piece is not None:
            return self.price_per_piece
        return self.price_per_pack / self.pieces_per_pack if self.pieces_per_pack else self.price_per_pack

    def __str__(self):
        return f"{self.name} ({self.sku})"


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    po_number = models.CharField(max_length=50, unique=True, default=generate_po_number)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="purchase_orders")
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    order_date = models.DateField(auto_now_add=True)
    expected_delivery = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    batched = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.po_number} - {self.product.name} ({self.status})"


class Batch(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="batches")
    batch_no = models.CharField(max_length=50, unique=True, default=generate_batch_no)
    quantity = models.PositiveIntegerField(default=0)
    supplier = models.CharField(max_length=100)
    received = models.DateField()
    orders = models.ManyToManyField("PurchaseOrder", related_name="batches", blank=True)
    

    def __str__(self):
        return f"{self.batch_no} - {self.product.name}"

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name