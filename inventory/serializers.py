from rest_framework import serializers
from .models import Product, Batch, PurchaseOrder, Supplier
from decimal import Decimal

class ProductSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = "__all__"

    def update(self, instance, validated_data):
        """
        Custom update method:
        - 
        Adds new quantity to existing quantity
        - Updates prices if provided
        - Updates other fields normally
        """
        qty = validated_data.pop("quantity", None)
        if qty is not None:
            instance.quantity = instance.quantity + int(qty)

        # Handle pricing fields safely
        for field in [
            "price_per_pack",
            "price_per_piece",
            "selling_price_per_pack",
            "selling_price_per_piece"
        ]:
            if field in validated_data and validated_data[field] is not None:
                validated_data[field] = Decimal(str(validated_data[field]))

        # Update remaining fields
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance

    def create(self, validated_data):
        """
        Custom create method:
        - Always create a new product
        - DRF will enforce unique SKU constraint automatically
        """
        # Convert pricing fields to Decimal
        for field in [
            "price_per_pack",
            "price_per_piece",
            "selling_price_per_pack",
            "selling_price_per_piece"
        ]:
            if field in validated_data and validated_data[field] is not None:
                validated_data[field] = Decimal(str(validated_data[field]))

        return super().create(validated_data)
    
    def get_stock(self, obj):
        return obj.get_stock()



class PurchaseOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "po_number",
            "product",
            "product_name",
            "supplier",
            "quantity",
            "order_date",
            "expected_delivery",
            "status",
        ]


# class BatchSerializer(serializers.ModelSerializer):
#     product_name = serializers.CharField(source="product.name", read_only=True)
#     orders = PurchaseOrderSerializer(many=True, read_only=True)  

#     class Meta:
#         model = Batch
#         fields = [
#             "id",
#             "batch_no",
#             "product",
#             "product_name",
#             "quantity",
#             "supplier",
#             "received",
#             "orders",   
#         ]

class BatchSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = Batch
        fields = "__all__" 

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"

