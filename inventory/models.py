from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Fields for auto-calculation
    daily_usage = models.PositiveIntegerField(default=5)     
    lead_time = models.PositiveIntegerField(default=10)       
    safety_stock = models.PositiveIntegerField(default=10)   
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.reorder_level = (self.daily_usage * self.lead_time) + self.safety_stock
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.sku})"


