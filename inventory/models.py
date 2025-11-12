from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)  # Total pieces in stock
    reorder_level = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price per whole unit (e.g., pack)

    # Unit breakdown
    unit_type = models.CharField(max_length=10, choices=[('pack', 'Pack'), ('piece', 'Piece')], default='pack')
    pieces_per_pack = models.PositiveIntegerField(default=1)  # e.g., 30 tablets per pack

    # Auto-calculation fields
    daily_usage = models.PositiveIntegerField(default=5)
    lead_time = models.PositiveIntegerField(default=10)
    safety_stock = models.PositiveIntegerField(default=10)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.reorder_level = (self.daily_usage * self.lead_time) + self.safety_stock
        super().save(*args, **kwargs)

    def price_per_piece(self):
        return self.price / self.pieces_per_pack if self.pieces_per_pack else self.price

    def __str__(self):
        return f"{self.name} ({self.sku})"



