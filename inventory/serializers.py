from rest_framework import serializers
from .models import Product, Batch, PurchaseOrder, Supplier

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


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


class BatchSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    orders = PurchaseOrderSerializer(many=True, read_only=True)  

    class Meta:
        model = Batch
        fields = [
            "id",
            "batch_no",
            "product",
            "product_name",
            "quantity",
            "supplier",
            "received",
            "orders",   
        ]

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"

