from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product

@receiver(post_save, sender=Product)
def check_low_stock(sender, instance, **kwargs):
    if instance.quantity <= instance.reorder_level:
        print(f"Low stock alert: {instance.name} has only {instance.quantity} items left.")
