from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)  

    # Pricing
    price_per_pack = models.DecimalField(max_digits=10, decimal_places=2)  
    price_per_piece = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  

    # Unit breakdown
    unit_type = models.CharField(max_length=10, choices=[('pack', 'Pack'), ('piece', 'Piece')], default='pack')
    pieces_per_pack = models.PositiveIntegerField(default=1)  

    # Inventory control
    reorder_level = models.PositiveIntegerField(default=0)
    daily_usage = models.PositiveIntegerField(default=5)
    lead_time = models.PositiveIntegerField(default=10)
    safety_stock = models.PositiveIntegerField(default=10)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.reorder_level = (self.daily_usage * self.lead_time) + self.safety_stock
        super().save(*args, **kwargs)

    def get_piece_price(self):
        
        if self.price_per_piece is not None:
            return self.price_per_piece
        return self.price_per_pack / self.pieces_per_pack if self.pieces_per_pack else self.price_per_pack

    def __str__(self):
        return f"{self.name} ({self.sku})"




