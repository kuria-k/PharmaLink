# from django.db import models
# from inventory.models import Product
# from datetime import datetime
# from decimal import Decimal
# from adminpanel.models import Branch

# class Branch(models.Model):
#     name = models.CharField(max_length=100)
#     location = models.CharField(max_length=255, blank=True, null=True)

#     def __str__(self):
#         return self.name


# # class Sale(models.Model):
# #     customer_name = models.CharField(max_length=255)
# #     invoice_number = models.CharField(max_length=50, unique=True, blank=True)
# #     total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
# #     created_at = models.DateTimeField(auto_now_add=True)
# #     branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="sales", null=True, blank=True)

# #     def save(self, *args, **kwargs):
# #         if not self.invoice_number:
# #             year_suffix = datetime.now().strftime('%y')
# #             prefix = f"CS0{year_suffix}"
# #             count = Sale.objects.filter(created_at__year=datetime.now().year).count() + 1
# #             sequence = str(count).zfill(7)
# #             self.invoice_number = f"{prefix}{sequence}"
# #         super().save(*args, **kwargs)

# #     def __str__(self):
# #         return f"{self.invoice_number} - {self.customer_name}"


# # class SaleItem(models.Model):
# #     UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

# #     sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
# #     product = models.ForeignKey(Product, on_delete=models.CASCADE)
# #     quantity = models.PositiveIntegerField()
# #     unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
# #     price = models.DecimalField(max_digits=10, decimal_places=2)
# #     vat = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))      
# #     discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))  

# #     def __str__(self):
# #         return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"
# class Sale(models.Model):
#     customer_name = models.CharField(max_length=255)
#     invoice_number = models.CharField(max_length=50, unique=True, blank=True)
#     total_amount = models.DecimalField(
#         max_digits=12,
#         decimal_places=2,
#         default=Decimal("0.00")
#     )
#     created_at = models.DateTimeField(auto_now_add=True)
#     branch = models.ForeignKey(
#         Branch,
#         on_delete=models.SET_NULL,   # ✅ safer: don’t cascade delete sales if branch is deleted
#         related_name="sales",
#         null=True,
#         blank=True
#     )

#     def save(self, *args, **kwargs):
#         if not self.invoice_number:
#             year_suffix = datetime.now().strftime('%y')
#             prefix = f"CS0{year_suffix}"
#             count = Sale.objects.filter(created_at__year=datetime.now().year).count() + 1
#             sequence = str(count).zfill(7)
#             self.invoice_number = f"{prefix}{sequence}"
#         # ✅ ensure total_amount is always a Decimal with 2 dp
#         if self.total_amount is None:
#             self.total_amount = Decimal("0.00")
#         else:
#             self.total_amount = self.total_amount.quantize(Decimal("0.00"))
#         super().save(*args, **kwargs)

#     def __str__(self):
#         branch_name = self.branch.name if self.branch else "No Branch"
#         return f"{self.invoice_number} - {self.customer_name} ({branch_name})"


# class SaleItem(models.Model):
#     UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

#     sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField()
#     unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
#     price = models.DecimalField(
#         max_digits=10,
#         decimal_places=2,
#         default=Decimal("0.00")
#     )
#     vat = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         default=Decimal("16.00")   # ✅ default VAT = 16%
#     )
#     discount = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         default=Decimal("0.00")
#     )

#     def save(self, *args, **kwargs):
#         # ✅ enforce safe decimals
#         if self.price is None:
#             self.price = Decimal("0.00")
#         else:
#             self.price = self.price.quantize(Decimal("0.00"))

#         if self.vat is None:
#             self.vat = Decimal("16.00")
#         else:
#             self.vat = self.vat.quantize(Decimal("0.00"))

#         if self.discount is None:
#             self.discount = Decimal("0.00")
#         else:
#             self.discount = self.discount.quantize(Decimal("0.00"))

#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"


# class Customer(models.Model):
#     name = models.CharField(max_length=100)
#     phone = models.CharField(max_length=20)
#     email = models.EmailField(unique=True)
#     address = models.TextField(blank=True, null=True)
#     total_sales = models.IntegerField(default=0)

#     def __str__(self):
#         return self.name


# from django.db import models
# from datetime import datetime
# from decimal import Decimal
# from django.contrib.auth.models import User   # ✅ import User
# from inventory.models import Product
# from adminpanel.models import Branch


# class Branch(models.Model):
#     name = models.CharField(max_length=100)
#     location = models.CharField(max_length=255, blank=True, null=True)

#     def __str__(self):
#         return self.name


# class Customer(models.Model):
#     name = models.CharField(max_length=100)
#     phone = models.CharField(max_length=20, blank=True, null=True)
#     email = models.EmailField(unique=True, blank=True, null=True)
#     address = models.TextField(blank=True, null=True)
#     total_sales = models.IntegerField(default=0)

#     def __str__(self):
#         return self.name


# class Sale(models.Model):
#     PAYMENT_METHODS = [
#         ("cash", "Cash"),
#         ("mpesa", "M-Pesa"),
#         ("card", "Card"),
#     ]
#     PAYMENT_STATUS = [
#         ("pending", "Pending"),
#         ("paid", "Paid"),
#         ("failed", "Failed"),
#     ]

#     customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
#     customer_name = models.CharField(max_length=255)  # fallback if no customer record
#     invoice_number = models.CharField(max_length=50, unique=True, blank=True)
#     total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
#     created_at = models.DateTimeField(auto_now_add=True)

#     branch = models.ForeignKey(
#         Branch, on_delete=models.SET_NULL, related_name="sales", null=True, blank=True
#     )

#     # Track who posted the sale
#     posted_by = models.CharField(max_length=150, blank=True, default="")

#     # Payment tracking
#     payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, blank=True, null=True)
#     payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")

#     # Cashier confirmation
#     confirmed_by = models.CharField(max_length=100, blank=True, null=True)
#     confirmed_at = models.DateTimeField(blank=True, null=True)

#     def save(self, *args, **kwargs):
#         if not self.invoice_number:
#             year_suffix = datetime.now().strftime('%y')
#             prefix = f"CS{year_suffix}"
#             count = Sale.objects.filter(created_at__year=datetime.now().year).count() + 1
#             sequence = str(count).zfill(7)
#             self.invoice_number = f"{prefix}{sequence}"

#         if self.total_amount is None:
#             self.total_amount = Decimal("0.00")

#         super().save(*args, **kwargs)

#     def __str__(self):
#         branch_name = self.branch.name if self.branch else "No Branch"
#         user_name = self.posted_by.username if self.posted_by else "Unknown User"
#         return f"{self.invoice_number} - {self.customer_name} ({branch_name}) by {user_name}"


# class SaleItem(models.Model):
#     UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

#     sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField()
#     unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
#     price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
#     vat = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("16.00"))   # default VAT = 16%
#     discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
#     line_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

#     def save(self, *args, **kwargs):
#         # Compute line total automatically
#         self.line_total = (self.quantity * self.price) - self.discount + self.vat
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"

from django.db import models
from decimal import Decimal
from django.contrib.auth import get_user_model
from datetime import datetime
from inventory.models import Product

User = get_user_model()


class Branch(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    total_sales = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Sale(models.Model):
    PAYMENT_METHODS = [
        ("cash", "Cash"),
        ("mpesa", "M-Pesa"),
        ("card", "Card"),
    ]
    PAYMENT_STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_name = models.CharField(max_length=255, default="Walk-in")
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Proper FK to User
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="sales")

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")

    confirmed_by = models.CharField(max_length=100, blank=True, null=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            year_suffix = datetime.now().strftime('%y')
            count = Sale.objects.filter(created_at__year=datetime.now().year).count() + 1
            self.invoice_number = f"CS{year_suffix}{str(count).zfill(7)}"
        super().save(*args, **kwargs)

    def __str__(self):
        branch_name = self.branch.name if self.branch else "No Branch"
        user_name = self.posted_by.username if self.posted_by else "Unknown"
        return f"{self.invoice_number} - {self.customer_name} ({branch_name}) by {user_name}"


class SaleItem(models.Model):
    UNIT_CHOICES = [('p', 'Piece'), ('w', 'Whole')]

    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=1, choices=UNIT_CHOICES, default='w')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    vat = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("16.00"))
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    def save(self, *args, **kwargs):
        self.line_total = (self.quantity * self.price) - self.discount + self.vat
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.get_unit_display()})"


