# from rest_framework import serializers
# from sales.models import Sale, SaleItem, Customer   # import only from the app you want
# from inventory.models import Product


# class SaleItemSerializer(serializers.ModelSerializer):
#     product_name = serializers.CharField(source='product.name', read_only=True)

#     class Meta:
#         model = SaleItem
#         fields = ['product', 'product_name', 'quantity', 'unit', 'price']


# class SaleSerializer(serializers.ModelSerializer):
#     items = SaleItemSerializer(many=True, read_only=True)
#     item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
#     invoice_number = serializers.CharField(read_only=True)
#     total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

#     class Meta:
#         model = Sale
#         fields = [
#             'id',
#             'customer_name',
#             'timestamp',
#             'invoice_number',
#             'total_amount',
#             'items',
#             'item_inputs'
#         ]

#     def create(self, validated_data):
#         items_data = validated_data.pop('item_inputs', [])
#         if not items_data:
#             raise serializers.ValidationError("At least one item is required to create a sale.")

#         sale = Sale.objects.create(**validated_data)
#         total = 0

#         for item_data in items_data:
#             product_id = item_data.get('product')
#             quantity = item_data.get('quantity', 1)
#             unit = item_data.get('unit', 'w')

#             # Validate product existence
#             try:
#                 product = Product.objects.get(id=product_id)
#             except Product.DoesNotExist:
#                 raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

#             # Determine price and stock deduction
#             if unit == 'p':
#                 if not hasattr(product, "get_piece_price"):
#                     raise serializers.ValidationError(
#                         f"Product {product.name} does not support piece pricing."
#                     )
#                 price = product.get_piece_price()
#                 units_to_deduct = quantity
#             else:
#                 if not hasattr(product, "price_per_pack") or not hasattr(product, "pieces_per_pack"):
#                     raise serializers.ValidationError(
#                         f"Product {product.name} is missing pack pricing attributes."
#                     )
#                 price = product.price_per_pack
#                 units_to_deduct = quantity * product.pieces_per_pack

#             # Stock check
#             if product.quantity < units_to_deduct:
#                 raise serializers.ValidationError(
#                     f"Insufficient stock for {product.name}. "
#                     f"Available: {product.quantity}, Required: {units_to_deduct}"
#                 )

#             # Deduct stock
#             product.quantity -= units_to_deduct
#             product.save()

#             # Create SaleItem
#             SaleItem.objects.create(
#                 sale=sale,
#                 product=product,
#                 quantity=quantity,
#                 unit=unit,
#                 price=price
#             )

#             total += price * quantity

#         # Update sale total
#         sale.total_amount = total
#         sale.save()
#         return sale


# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = "__all__"

# from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
# from rest_framework import serializers
# from sales.models import Sale, SaleItem, Customer
# from inventory.models import Product


# class SaleItemSerializer(serializers.ModelSerializer):
#     product_name = serializers.CharField(source='product.name', read_only=True)

#     class Meta:
#         model = SaleItem
#         fields = [
#             'product',
#             'product_name',
#             'quantity',
#             'unit',
#             'price',
#             'vat',
#             'discount',
#         ]

    # --- Sanitize output so bad DB values don't crash serialization ---
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     for field in ['price', 'vat', 'discount']:
    #         try:
    #             data[field] = str(safe_decimal(data[field], 0).quantize(Decimal("0.00")))
    #         except Exception:
    #             data[field] = "0.00"
    #     return data


# --- Strong helper for safe Decimal conversion ---
# def safe_decimal(value, default=0):
#     """
#     Safely convert a value to Decimal.
#     Falls back to default if value is None, empty, or invalid.
#     """
#     try:
#         if value is None:
#             return Decimal(default)
#         if isinstance(value, (int, float, Decimal)):
#             return Decimal(str(value))
#         if isinstance(value, str):
#             val = value.strip()
#             if val == "":
#                 return Decimal(default)
#             return Decimal(val)
#         return Decimal(default)
#     except (InvalidOperation, ValueError, TypeError):
#         return Decimal(default)


# class SaleSerializer(serializers.ModelSerializer):
#     items = SaleItemSerializer(many=True, read_only=True)
#     item_inputs = serializers.ListSerializer(
#         child=serializers.DictField(),
#         write_only=True
#     )
#     invoice_number = serializers.CharField(read_only=True)
#     total_amount = serializers.DecimalField(
#         max_digits=12,
#         decimal_places=2,
#         read_only=True
#     )
#     timestamp = serializers.DateTimeField(source='created_at', read_only=True)

#     class Meta:
#         model = Sale
#         fields = [
#             'id',
#             'customer_name',
#             'timestamp',
#             'invoice_number',
#             'total_amount',
#             'items',
#             'item_inputs',
#         ]

#     def create(self, validated_data):
#         items_data = validated_data.pop('item_inputs', [])
#         if not items_data:
#             raise serializers.ValidationError(
#                 "At least one item is required to create a sale."
#             )

#         sale = Sale.objects.create(**validated_data)
#         total = Decimal("0.00")

#         for item_data in items_data:
#             product_id = item_data.get('product')
#             quantity = int(item_data.get('quantity', 1))
#             unit = item_data.get('unit', 'w')

#             vat_rate = Decimal(str(item_data.get('vat', 16)))        # % rate
#             discount_rate = Decimal(str(item_data.get('discount', 0)))  # % rate

#             try:
#                 product = Product.objects.get(id=product_id)
#             except Product.DoesNotExist:
#                 raise serializers.ValidationError(
#                     f"Product with ID {product_id} does not exist."
#                 )

#             price = Decimal(str(product.price_per_pack))

#             # base total
#             line_total = price * quantity

#             # apply discount first
#             discount_amount = (discount_rate / Decimal("100")) * line_total
#             taxable = line_total - discount_amount

#             # apply VAT after discount
#             vat_amount = (vat_rate / Decimal("100")) * taxable
#             nett = taxable + vat_amount

#             # stock check + deduction
#             if product.quantity < quantity:
#                 raise serializers.ValidationError(
#                     f"Insufficient stock for {product.name}."
#                 )
#             product.quantity -= quantity
#             product.save()

#             # ✅ Save amounts, not rates
#             SaleItem.objects.create(
#                 sale=sale,
#                 product=product,
#                 quantity=quantity,
#                 unit=unit,
#                 price=price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),
#                 vat=vat_amount.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),
#                 discount=discount_amount.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),
#             )

#             total += nett

#         sale.total_amount = total.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
#         sale.save()
#         return sale


# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = "__all__"





from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from rest_framework import serializers
from sales.models import Sale, SaleItem, Customer
from inventory.models import Product


def safe_decimal(value, default=0):
    """
    Safely convert a value to Decimal.
    Falls back to default if value is None, empty, or invalid.
    """
    try:
        if value is None:
            return Decimal(default)
        if isinstance(value, (int, float, Decimal)):
            return Decimal(str(value))
        if isinstance(value, str):
            val = value.strip()
            if val == "":
                return Decimal(default)
            return Decimal(val)
        return Decimal(default)
    except (InvalidOperation, ValueError, TypeError):
        return Decimal(default)


class SaleItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual sale items.
    Includes computed fields for discount and VAT rates/amounts.
    """
    product_name = serializers.CharField(source='product.name', read_only=True)
    discount_rate = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    vat_rate = serializers.SerializerMethodField()
    vat_amount = serializers.SerializerMethodField()

    class Meta:
        model = SaleItem
        fields = [
            'product',
            'product_name',
            'quantity',
            'unit',
            'price',
            'vat',             # stored amount
            'vat_rate',        # percentage
            'vat_amount',      # amount
            'discount',        # stored amount
            'discount_rate',   # percentage
            'discount_amount', # amount
        ]

    def get_discount_rate(self, obj):
        line_total = safe_decimal(obj.price, 0) * safe_decimal(obj.quantity, 1)
        if line_total > 0:
            rate = (safe_decimal(obj.discount, 0) / line_total) * Decimal("100")
            return str(rate.quantize(Decimal("0.00")))
        return "0.00"

    def get_discount_amount(self, obj):
        return str(safe_decimal(obj.discount, 0).quantize(Decimal("0.00")))

    def get_vat_rate(self, obj):
        # If VAT is always 16%, you can hardcode or compute from amount
        return "16.00"

    def get_vat_amount(self, obj):
        return str(safe_decimal(obj.vat, 0).quantize(Decimal("0.00")))

    def to_representation(self, instance):
        """
        Ensure price, VAT, and discount are always serialized as valid decimals.
        """
        data = super().to_representation(instance)
        for field in ['price', 'vat', 'discount']:
            try:
                data[field] = str(safe_decimal(data[field], 0).quantize(Decimal("0.00")))
            except Exception:
                data[field] = "0.00"
        return data


class SaleSerializer(serializers.ModelSerializer):
    """
    Serializer for a full sale transaction.
    Handles nested items and business logic for VAT/discount/stock.
    """
    items = SaleItemSerializer(many=True, read_only=True)
    item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
    invoice_number = serializers.CharField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    date = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = [
            'id',
            'customer_name',
            'date',
            'invoice_number',
            'total_amount',
            'items',
            'item_inputs',
        ]

    # --- Custom validation for item_inputs ---
    def validate_item_inputs(self, value):
        """
        Validate each item in item_inputs before creating the Sale.
        """
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one item is required.")

        for idx, item in enumerate(value, start=1):
            # Ensure product ID is provided
            if not item.get("product"):
                raise serializers.ValidationError(
                    {f"item_{idx}": "Product ID is required."}
                )

            # Ensure quantity is positive
            quantity = item.get("quantity", 1)
            try:
                quantity = int(quantity)
                if quantity <= 0:
                    raise serializers.ValidationError(
                        {f"item_{idx}": "Quantity must be greater than zero."}
                    )
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    {f"item_{idx}": "Quantity must be a valid integer."}
                )

            # Ensure discount is not negative
            discount = safe_decimal(item.get("discount"), 0)
            if discount < 0:
                raise serializers.ValidationError(
                    {f"item_{idx}": "Discount cannot be negative."}
                )

            # Ensure VAT is not negative
            vat = safe_decimal(item.get("vat"), 16)
            if vat < 0:
                raise serializers.ValidationError(
                    {f"item_{idx}": "VAT cannot be negative."}
                )

        return value

    def create(self, validated_data):
        """
        Create a Sale with its SaleItems, applying VAT and discounts.
        """
        items_data = validated_data.pop('item_inputs', [])
        if not items_data:
            raise serializers.ValidationError("At least one item is required to create a sale.")

        sale = Sale.objects.create(**validated_data)
        total = Decimal("0.00")

        for item_data in items_data:
            # --- Extract per-item values ---
            product_id = item_data.get('product')
            quantity = int(item_data.get('quantity', 1))
            unit = item_data.get('unit', 'w')

            vat_rate = safe_decimal(item_data.get('vat'), 16)
            discount_rate = safe_decimal(item_data.get('discount'), 0)

            # --- Validate product existence ---
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

            price = safe_decimal(product.price_per_pack, 0)

            # --- Calculations ---
            line_total = price * quantity
            discount_amount = (discount_rate / Decimal("100")) * line_total
            taxable = line_total - discount_amount
            vat_amount = (vat_rate / Decimal("100")) * taxable
            nett = taxable + vat_amount

            # --- Stock check + deduction ---
            if product.quantity < quantity:
                raise serializers.ValidationError(f"Insufficient stock for {product.name}.")
            product.quantity -= quantity
            product.save()

            # --- Create SaleItem ---
            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit=unit,
                price=price.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),
                vat=vat_amount.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),        # amount
                discount=discount_amount.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP),  # amount
            )

            total += nett

        # --- Finalize sale total ---
        sale.total_amount = total.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
        sale.save()
        return sale

    def to_representation(self, instance):
        """
        Ensure total_amount is always serialized as a valid decimal.
        """
        data = super().to_representation(instance)
        try:
            data['total_amount'] = str(safe_decimal(data['total_amount'], 0).quantize(Decimal("0.00")))
        except Exception:
            data['total_amount'] = "0.00"
        return data

    def get_date(self, obj):
        return obj.created_at.date().isoformat()



class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model."""
    class Meta:
        model = Customer
        fields = "__all__"







