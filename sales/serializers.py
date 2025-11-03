from rest_framework import serializers
from .models import Sale, SaleItem

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['product', 'product_name', 'quantity', 'price']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    invoice_number = serializers.CharField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'customer_name', 'timestamp', 'invoice_number', 'total_amount', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale = Sale.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            item = SaleItem.objects.create(sale=sale, **item_data)
            total += item.price * item.quantity
        sale.total_amount = total
        sale.save()
        return sale
