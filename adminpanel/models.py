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
    name = models.CharField(max_length=100, unique=True)   # ✅ unique branch names
    location = models.CharField(max_length=255, blank=True) # ✅ optional location

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('cashier', 'Cashier'),
        ('sales', 'Sales'),
        ('inventory', 'Inventory'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"   #  easier reverse lookup
    )
    branches = models.ManyToManyField(
        Branch,
        blank=True                #  optional, avoids migration/validation errors
    )
    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default='cashier'         # default role so it’s never empty
    )

    def __str__(self):
        return self.user.username
