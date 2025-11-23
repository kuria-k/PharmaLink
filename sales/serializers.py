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





# from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
# from rest_framework import serializers
# from sales.models import Sale, SaleItem, Customer
# from inventory.models import Product
# import uuid


# def safe_decimal(value, default="0.00"):
#     """
#     Safely convert a value to Decimal.
#     Handles None, empty strings, bad strings, NaN/Infinity.
#     """
#     try:
#         if value is None:
#             return Decimal(default)
#         if isinstance(value, (int, float, Decimal)):
#             return Decimal(str(value))
#         if isinstance(value, str):
#             val = value.strip()
#             if val == "" or val.lower() in ["nan", "inf", "infinity"]:
#                 return Decimal(default)
#             return Decimal(val)
#         return Decimal(default)
#     except (InvalidOperation, ValueError, TypeError):
#         return Decimal(default)


# def safe_quantize(value, default="0.00"):
#     """
#     Convert to Decimal and quantize to 2 decimal places safely.
#     Always returns a finite Decimal with 2 dp.
#     """
#     d = safe_decimal(value, default)
#     if not d.is_finite():
#         d = Decimal(default)
#     return d.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)


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

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         for field in ['price', 'vat', 'discount']:
#             data[field] = str(safe_quantize(data[field]))
#         return data


# class SaleSerializer(serializers.ModelSerializer):
#     items = SaleItemSerializer(many=True, read_only=True)
#     item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
#     invoice_number = serializers.CharField(read_only=True)
#     total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
#     date = serializers.SerializerMethodField()

#     class Meta:
#         model = Sale
#         fields = [
#             'id',
#             'customer_name',
#             'date',
#             'invoice_number',
#             'total_amount',
#             'items',
#             'item_inputs',
#         ]

#     def get_date(self, obj):
#         return obj.created_at.date().isoformat()

#     def validate_item_inputs(self, value):
#         if not value or len(value) == 0:
#             raise serializers.ValidationError("At least one item is required.")

#         for idx, item in enumerate(value, start=1):
#             if not item.get("product"):
#                 raise serializers.ValidationError({f"item_{idx}": "Product ID is required."})

#             try:
#                 quantity = int(item.get("quantity", 1))
#                 if quantity <= 0:
#                     raise serializers.ValidationError({f"item_{idx}": "Quantity must be greater than zero."})
#             except (ValueError, TypeError):
#                 raise serializers.ValidationError({f"item_{idx}": "Quantity must be a valid integer."})

#             # enforce discount ≤ 15%
#             discount = safe_decimal(item.get("discount"), "0.00")
#             if discount < 0:
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot be negative."})
#             if discount > Decimal("15"):
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot exceed 15%."})

#             # enforce VAT = 16% by default
#             vat = safe_decimal(item.get("vat"), "16.00")
#             if vat != Decimal("16.00"):
#                 raise serializers.ValidationError({f"item_{idx}": "VAT must be 16%."})

#             if item.get("price") in (None, "", " "):
#                 raise serializers.ValidationError({f"item_{idx}": "Price is required."})

#         return value

#     def _generate_invoice_number(self):
#         return f"CS{str(uuid.uuid4())[:8].upper()}"

#     def create(self, validated_data):
#         items_data = validated_data.pop('item_inputs', [])
#         if not items_data:
#             raise serializers.ValidationError("At least one item is required to create a sale.")

#         sale = Sale.objects.create(
#             customer_name=validated_data.get('customer_name'),
#             total_amount=safe_quantize(validated_data.get('total_amount')),
#             invoice_number=self._generate_invoice_number(),
#         )

#         for item_data in items_data:
#             product_id = item_data.get('product')
#             try:
#                 product = Product.objects.get(id=product_id)
#             except Product.DoesNotExist:
#                 raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

#             quantity = int(item_data.get('quantity', 1))
#             if hasattr(product, 'quantity'):
#                 if product.quantity < quantity:
#                     raise serializers.ValidationError(f"Insufficient stock for {product.name}.")
#                 product.quantity -= quantity
#                 product.save()

#             SaleItem.objects.create(
#                 sale=sale,
#                 product=product,
#                 quantity=quantity,
#                 unit=item_data.get('unit', 'w'),
#                 price=safe_quantize(item_data.get('price')),
#                 vat=Decimal("16.00"),  # enforce VAT = 16%
#                 discount=safe_quantize(item_data.get('discount')),
#             )

#         return sale


# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = "__all__"





# from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
# from rest_framework import serializers
# from sales.models import Sale, SaleItem, Customer
# from inventory.models import Product
# import uuid


# def safe_decimal(value, default="0.00"):
#     """
#     Safely convert a value to Decimal.
#     Handles None, empty strings, bad strings, NaN/Infinity.
#     """
#     try:
#         if value is None:
#             return Decimal(default)
#         if isinstance(value, (int, float, Decimal)):
#             return Decimal(str(value))
#         if isinstance(value, str):
#             val = value.strip()
#             if val == "" or val.lower() in ["nan", "inf", "infinity"]:
#                 return Decimal(default)
#             return Decimal(val)
#         return Decimal(default)
#     except (InvalidOperation, ValueError, TypeError):
#         return Decimal(default)


# def safe_quantize(value, default="0.00"):
#     """
#     Convert to Decimal and quantize to 2 decimal places safely.
#     Always returns a finite Decimal with 2 dp.
#     """
#     d = safe_decimal(value, default)
#     if not d.is_finite():
#         d = Decimal(default)
#     return d.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)


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

#     def to_representation(self, instance):
#         """
#         Safely format decimals when serializing for GET.
#         Use instance.<field> (a Decimal) directly.
#         """
#         data = super().to_representation(instance)
#         for field in ['price', 'vat', 'discount']:
#             try:
#                 val = getattr(instance, field)  # actual Decimal from DB
#                 data[field] = f"{safe_quantize(val)}"
#             except Exception:
#                 data[field] = "0.00"
#         return data


# class SaleSerializer(serializers.ModelSerializer):
#     items = SaleItemSerializer(many=True, read_only=True)
#     item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
#     invoice_number = serializers.CharField(read_only=True)
#     total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
#     date = serializers.SerializerMethodField()

#     class Meta:
#         model = Sale
#         fields = [
#             'id',
#             'customer_name',
#             'date',
#             'invoice_number',
#             'total_amount',
#             'items',
#             'item_inputs',
#         ]

#     def get_date(self, obj):
#         return obj.created_at.date().isoformat()

#     def validate_item_inputs(self, value):
#         if not value or len(value) == 0:
#             raise serializers.ValidationError("At least one item is required.")

#         for idx, item in enumerate(value, start=1):
#             if not item.get("product"):
#                 raise serializers.ValidationError({f"item_{idx}": "Product ID is required."})

#             try:
#                 quantity = int(item.get("quantity", 1))
#                 if quantity <= 0:
#                     raise serializers.ValidationError({f"item_{idx}": "Quantity must be greater than zero."})
#             except (ValueError, TypeError):
#                 raise serializers.ValidationError({f"item_{idx}": "Quantity must be a valid integer."})

#             # enforce discount ≤ 15%
#             discount = safe_decimal(item.get("discount"), "0.00")
#             if discount < 0:
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot be negative."})
#             if discount > Decimal("15"):
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot exceed 15%."})

#             # enforce VAT = 16% by default
#             vat = safe_decimal(item.get("vat"), "16.00")
#             if vat != Decimal("16.00"):
#                 raise serializers.ValidationError({f"item_{idx}": "VAT must be 16%."})

#             if item.get("price") in (None, "", " "):
#                 raise serializers.ValidationError({f"item_{idx}": "Price is required."})

#         return value

#     def _generate_invoice_number(self):
#         return f"CS{str(uuid.uuid4())[:8].upper()}"

#     def create(self, validated_data):
#         items_data = validated_data.pop('item_inputs', [])
#         if not items_data:
#             raise serializers.ValidationError("At least one item is required to create a sale.")

#         sale = Sale.objects.create(
#             customer_name=validated_data.get('customer_name'),
#             total_amount=safe_quantize(validated_data.get('total_amount')),
#             invoice_number=self._generate_invoice_number(),
#         )

#         for item_data in items_data:
#             product_id = item_data.get('product')
#             try:
#                 product = Product.objects.get(id=product_id)
#             except Product.DoesNotExist:
#                 raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

#             quantity = int(item_data.get('quantity', 1))
#             if hasattr(product, 'quantity'):
#                 if product.quantity < quantity:
#                     raise serializers.ValidationError(f"Insufficient stock for {product.name}.")
#                 product.quantity -= quantity
#                 product.save()

#             SaleItem.objects.create(
#                 sale=sale,
#                 product=product,
#                 quantity=quantity,
#                 unit=item_data.get('unit', 'w'),
#                 price=safe_quantize(item_data.get('price')),
#                 vat=Decimal("16.00"),  # enforce VAT = 16%
#                 discount=safe_quantize(item_data.get('discount')),
#             )

#         return sale


# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = "__all__"

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from rest_framework import serializers
from sales.models import Sale, SaleItem, Customer
from inventory.models import Product
import uuid


def safe_decimal(value, default="0.00"):
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
    d = safe_decimal(value, default)
    if not d.is_finite():
        d = Decimal(default)
    try:
        return d.quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)
    except InvalidOperation:
        return Decimal(default).quantize(Decimal("0.00"), rounding=ROUND_HALF_UP)


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
        # Force safe decimals
        data["price"] = str(safe_quantize(instance.price))
        data["vat"] = str(safe_quantize(instance.vat, "16.00"))
        data["discount"] = str(safe_quantize(instance.discount))
        return data


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
        # Force safe decimal output
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
                vat=Decimal("16.00"),
                discount=safe_quantize(item_data.get("discount")),
            )

        return sale


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
