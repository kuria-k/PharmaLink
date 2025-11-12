from rest_framework import serializers
from .models import Sale, SaleItem
from inventory.models import Product

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['product', 'product_name', 'quantity', 'unit', 'price']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
    invoice_number = serializers.CharField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'customer_name', 'timestamp', 'invoice_number', 'total_amount', 'items', 'item_inputs']

    def create(self, validated_data):
        items_data = validated_data.pop('item_inputs') 
        sale = Sale.objects.create(**validated_data)
        total = 0

        for item_data in items_data:
            product_id = item_data.get('product')
            quantity = item_data.get('quantity')
            unit = item_data.get('unit', 'w')

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

            if unit == 'p':
                price = product.get_piece_price()
                units_to_deduct = quantity
            else:
                price = product.price_per_pack
                units_to_deduct = quantity * product.pieces_per_pack

            if product.quantity < units_to_deduct:
                raise serializers.ValidationError(
                    f"Insufficient stock for {product.name}. Available: {product.quantity}, Required: {units_to_deduct}"
                )

            product.quantity -= units_to_deduct
            product.save()

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit=unit,
                price=price
            )

            total += price * quantity

        sale.total_amount = total
        sale.save()
        return sale
