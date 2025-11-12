from django.db import models
from django.utils import timezone
from sales.models import Sale
from inventory.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class AuditLog(models.Model):
    action = models.CharField(max_length=100)
    actor = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.timestamp} - {self.action} by {self.actor}"


class ReportEntry(models.Model):
    report_type = models.CharField(max_length=50)
    generated_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField()
    data = models.JSONField()

    def __str__(self):
        return f"{self.report_type} @ {self.generated_at.strftime('%Y-%m-%d %H:%M')}"

    def save(self, *args, **kwargs):
        self.generate()  # ✅ Automatically populate summary and data
        super().save(*args, **kwargs)

    def generate(self):
        now = timezone.now()
        today = now.date()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)

        # Total sales today
        sales_today = Sale.objects.filter(timestamp__date=today)
        total_sales_today = sum(s.total_amount for s in sales_today)

        # Total sales per user
        sales_by_user = {}
        for sale in sales_today:
            user = getattr(sale, 'created_by', None)
            key = user.username if user else 'Unknown'
            sales_by_user[key] = sales_by_user.get(key, 0) + sale.total_amount

        # Total inventory
        total_inventory = Product.objects.aggregate(total=models.Sum('quantity'))['total'] or 0

        # Total sales month-to-date
        sales_month = Sale.objects.filter(timestamp__date__gte=month_start)
        total_sales_month = sum(s.total_amount for s in sales_month)

        # Total sales year-to-date
        sales_year = Sale.objects.filter(timestamp__date__gte=year_start)
        total_sales_year = sum(s.total_amount for s in sales_year)

        self.data = {
            'total_sales_today': float(total_sales_today),
            'sales_by_user': {user: float(amount) for user, amount in sales_by_user.items()},
            'total_inventory': total_inventory,
            'total_sales_month_to_date': float(total_sales_month),
            'total_sales_year_to_date': float(total_sales_year),
        }

        self.summary = (
            f"Sales Today: KSh {total_sales_today:.2f}, "
            f"Inventory: {total_inventory} items, "
            f"Month-to-date: KSh {total_sales_month:.2f}, "
            f"Year-to-date: KSh {total_sales_year:.2f}"
        )


