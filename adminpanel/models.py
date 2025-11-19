# from django.db import models
# from django.contrib.auth.models import User

# class Branch(models.Model):
#     name = models.CharField(max_length=100)
#     location = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     branches = models.ManyToManyField(Branch)
#     role = models.CharField(max_length=50, choices=[('admin', 'Admin'), ('cashier', 'Cashier'), ('sales', 'Sales'), ('inventory', 'Inventory'),])

#     def __str__(self):
#         return self.user.username

from django.db import models
from django.contrib.auth.models import User

class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=0)
    price_per_pack = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Sale(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="sales")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale {self.id} - {self.branch.name}"


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('cashier', 'Cashier'),
        ('sales', 'Sales'),
        ('inventory', 'Inventory'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    branches = models.ManyToManyField(Branch, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='cashier')

    def __str__(self):
        return self.user.username

