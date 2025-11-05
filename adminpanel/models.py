from django.db import models
from django.contrib.auth.models import User

class Branch(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    branches = models.ManyToManyField(Branch)
    role = models.CharField(max_length=50, choices=[('admin', 'Admin'), ('staff', 'Staff')])

    def __str__(self):
        return self.user.username

