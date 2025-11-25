from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from rest_framework import serializers
from sales.models import Sale, SaleItem, Customer
from inventory.models import Product
import uuid


# ---------- Utility functions ----------
def safe_decimal(value, default="0.00"):
    """Convert any value into a safe Decimal."""
    try:
        if value is None:
            return Decimal(default)
        if isinstance(value, (int, float, Decimal)):
            return Decimal(str(value))
        if isinstance(value, str):
            val = value.strip()
            if val == "" or val.lower() in ["nan", "inf", "infinity"]:
                return Decimal(default)
            return Decimal(val)
        return Decimal(default)
    except (InvalidOperation, ValueError, TypeError):
        return Decimal(default)


def safe_quantize(value, default="0.00"):
    """Force a Decimal to two decimal places safely."""
    d = safe_decimal(value, default)
    if not d.is_finite():
        d = Decimal(default)
    try:
        return d.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    except InvalidOperation:
        return Decimal(default).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


# ---------- SaleItem Serializer ----------
class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = SaleItem
        fields = [
            "product",
            "product_name",
            "quantity",
            "unit",
            "price",
            "vat",
            "discount",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure decimals are always safe and stringified
        data["price"] = str(safe_quantize(instance.price))
        data["vat"] = str(safe_quantize(instance.vat, "16.00"))
        data["discount"] = str(safe_quantize(instance.discount))
        return data


# ---------- Sale Serializer ----------
class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
    invoice_number = serializers.CharField(read_only=True)
    total_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        default=Decimal("0.00"),
    )
    date = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = [
            "id",
            "customer_name",
            "date",
            "invoice_number",
            "total_amount",
            "items",
            "item_inputs",
        ]

    def get_date(self, obj):
        return obj.created_at.date().isoformat()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Force safe decimal output for total_amount
        data["total_amount"] = str(safe_quantize(instance.total_amount))
        return data

    def validate_item_inputs(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")

        for idx, item in enumerate(value, start=1):
            if not item.get("product"):
                raise serializers.ValidationError({f"item_{idx}": "Product ID is required."})

            try:
                quantity = int(item.get("quantity", 1))
                if quantity <= 0:
                    raise serializers.ValidationError({f"item_{idx}": "Quantity must be greater than zero."})
            except (ValueError, TypeError):
                raise serializers.ValidationError({f"item_{idx}": "Quantity must be a valid integer."})

            discount = safe_decimal(item.get("discount"), "0.00")
            if discount < 0:
                raise serializers.ValidationError({f"item_{idx}": "Discount cannot be negative."})
            if discount > Decimal("15"):
                raise serializers.ValidationError({f"item_{idx}": "Discount cannot exceed 15%."})

            vat = safe_decimal(item.get("vat"), "16.00")
            if vat.quantize(Decimal("0.00")) != Decimal("16.00"):
                raise serializers.ValidationError({f"item_{idx}": "VAT must be 16%."})

            if item.get("price") in (None, "", " "):
                raise serializers.ValidationError({f"item_{idx}": "Price is required."})

        return value

    def _generate_invoice_number(self):
        return f"CS{str(uuid.uuid4())[:8].upper()}"

    def create(self, validated_data):
        items_data = validated_data.pop("item_inputs", [])
        if not items_data:
            raise serializers.ValidationError("At least one item is required to create a sale.")

        sale = Sale.objects.create(
            customer_name=validated_data.get("customer_name"),
            total_amount=safe_quantize(validated_data.get("total_amount")),
            invoice_number=self._generate_invoice_number(),
        )

        for item_data in items_data:
            product_id = item_data.get("product")
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

            quantity = int(item_data.get("quantity", 1))
            if hasattr(product, "quantity"):
                if product.quantity < quantity:
                    raise serializers.ValidationError(f"Insufficient stock for {product.name}.")
                product.quantity -= quantity
                product.save()

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit=item_data.get("unit", "w"),
                price=safe_quantize(item_data.get("price")),
                vat=safe_quantize(item_data.get("vat", "16.00")),
                discount=safe_quantize(item_data.get("discount")),
            )

        return sale


# ---------- Customer Serializer ----------
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
