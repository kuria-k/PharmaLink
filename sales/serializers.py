# from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
# from rest_framework import serializers
# from sales.models import Sale, SaleItem, Customer
# from inventory.models import Product
# import uuid


# # ---------- Utility functions ----------
# def safe_decimal(value, default="0.00"):
#     """Convert any value into a safe Decimal."""
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
#     """Force a Decimal to two decimal places safely."""
#     d = safe_decimal(value, default)
#     if not d.is_finite():
#         d = Decimal(default)
#     try:
#         return d.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
#     except InvalidOperation:
#         return Decimal(default).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


# # ---------- SaleItem Serializer ----------
# class SaleItemSerializer(serializers.ModelSerializer):
#     product_name = serializers.CharField(source="product.name", read_only=True)

#     class Meta:
#         model = SaleItem
#         fields = [
#             "product",
#             "product_name",
#             "quantity",
#             "unit",
#             "price",
#             "vat",
#             "discount",
#         ]

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         # Ensure decimals are always safe and stringified
#         data["price"] = str(safe_quantize(instance.price))
#         data["vat"] = str(safe_quantize(instance.vat, "16.00"))
#         data["discount"] = str(safe_quantize(instance.discount))
#         return data


# # ---------- Sale Serializer ----------
# class SaleSerializer(serializers.ModelSerializer):
#     items = SaleItemSerializer(many=True, read_only=True)
#     item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
#     invoice_number = serializers.CharField(read_only=True)
#     total_amount = serializers.DecimalField(
#         max_digits=12,
#         decimal_places=2,
#         required=False,
#         default=Decimal("0.00"),
#     )
#     date = serializers.SerializerMethodField()
#     posted_by = serializers.ReadOnlyField(source="posted_by.username")   #  show username
#     branch_name = serializers.ReadOnlyField(source="branch.name")        #  show branch name

#     class Meta:
#         model = Sale
#         fields = [
#             "id",
#             "customer_name",
#             "date",
#             "invoice_number",
#             "total_amount",
#             "items",
#             "item_inputs",
#             "posted_by",     
#             "branch_name",   
#         ]

#     def get_date(self, obj):
#         return obj.created_at.date().isoformat()

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         # Force safe decimal output for total_amount
#         data["total_amount"] = str(safe_quantize(instance.total_amount))
#         return data

#     def validate_item_inputs(self, value):
#         if not value:
#             raise serializers.ValidationError("At least one item is required.")

#         for idx, item in enumerate(value, start=1):
#             if not item.get("product"):
#               raise serializers.ValidationError({f"item_{idx}": "Product name is required."})


#             try:
#                 quantity = int(item.get("quantity", 1))
#                 if quantity <= 0:
#                     raise serializers.ValidationError({f"item_{idx}": "Quantity must be greater than zero."})
#             except (ValueError, TypeError):
#                 raise serializers.ValidationError({f"item_{idx}": "Quantity must be a valid integer."})

#             discount = safe_decimal(item.get("discount"), "0.00")
#             if discount < 0:
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot be negative."})
#             if discount > Decimal("15"):
#                 raise serializers.ValidationError({f"item_{idx}": "Discount cannot exceed 15%."})

#             vat = safe_decimal(item.get("vat"), "16.00")
#             if vat.quantize(Decimal("0.00")) != Decimal("16.00"):
#                 raise serializers.ValidationError({f"item_{idx}": "VAT must be 16%."})

#             if item.get("price") in (None, "", " "):
#                 raise serializers.ValidationError({f"item_{idx}": "Price is required."})

#         return value

#     def _generate_invoice_number(self):
#         return f"CS{str(uuid.uuid4())[:8].upper()}"

#     def create(self, validated_data):
#         items_data = validated_data.pop("item_inputs", [])
#         if not items_data:
#             raise serializers.ValidationError("At least one item is required to create a sale.")

#         # ✅ posted_by and branch are set in the view (perform_create)
#         sale = Sale.objects.create(
#             customer_name=validated_data.get("customer_name"),
#             total_amount=safe_quantize(validated_data.get("total_amount")),
#             invoice_number=self._generate_invoice_number(),
#             posted_by=validated_data.get("posted_by"),
#             branch=validated_data.get("branch"),
#         )

#         for item_data in items_data:
#             product_name = item_data.get("product")
#             try:
#               product = Product.objects.get(name=product_name)
#             except Product.DoesNotExist:
#               raise serializers.ValidationError(f"Product with name {product_name} does not exist.")

#             quantity = int(item_data.get("quantity", 1))
#             if hasattr(product, "quantity"):
#                 if product.quantity < quantity:
#                     raise serializers.ValidationError(f"Insufficient stock for {product.name}.")
#                 product.quantity -= quantity
#                 product.save()

#             SaleItem.objects.create(
#                 sale=sale,
#                 product=product,
#                 quantity=quantity,
#                 unit=item_data.get("unit", "w"),
#                 price=safe_quantize(item_data.get("price")),
#                 vat=safe_quantize(item_data.get("vat", "16.00")),
#                 discount=safe_quantize(item_data.get("discount")),
#             )

#         return sale


# # ---------- Customer Serializer ----------
# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = "__all__"

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from rest_framework import serializers
from sales.models import Sale, SaleItem, Customer
from inventory.models import Product
from decimal import Decimal
from adminpanel.models import Branch, UserProfile
from django.contrib.auth.models import User
import uuid

# ---------- Utility functions ----------
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
        return d.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    except InvalidOperation:
        return Decimal(default).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

# ---------- SaleItem Serializer ----------
class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = SaleItem
        fields = ["product", "product_name", "quantity", "unit", "price", "vat", "discount"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["price"] = str(safe_quantize(instance.price))
        data["vat"] = str(safe_quantize(instance.vat, "16.00"))
        data["discount"] = str(safe_quantize(instance.discount))
        return data

# ---------- Sale Serializer ----------
class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    item_inputs = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
    invoice_number = serializers.CharField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=Decimal("0.00"))
    date = serializers.SerializerMethodField()

    # Accept posted_by_username only
    posted_by_username = serializers.CharField(write_only=True, required=True)

    # Output posted_by as username
    posted_by = serializers.ReadOnlyField(source="posted_by.username")

    branch = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    branch_name = serializers.ReadOnlyField(source="branch.name")

    client_number = serializers.CharField(required=False, allow_blank=True, read_only=True)

    class Meta:
        model = Sale
        fields = [
            "id", "customer_name", "client_number", "date", "invoice_number",
            "total_amount", "items", "item_inputs",
            "posted_by", "branch", "branch_name",
            "posted_by_username",
        ]
        read_only_fields = ["client_number"]

    def get_date(self, obj):
        return obj.created_at.date().isoformat()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["total_amount"] = str(safe_quantize(instance.total_amount))
        return data

    def validate_item_inputs(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        
        # Validate each item has required fields
        for idx, item in enumerate(value):
            if not item.get("product"):
                raise serializers.ValidationError(f"Item {idx + 1}: product is required.")
            if not item.get("quantity") or int(item.get("quantity", 0)) <= 0:
                raise serializers.ValidationError(f"Item {idx + 1}: quantity must be greater than 0.")
            if "price" not in item:
                raise serializers.ValidationError(f"Item {idx + 1}: price is required.")
            try:
                price = Decimal(str(item.get("price", 0)))
                if price < 0:
                    raise serializers.ValidationError(f"Item {idx + 1}: price cannot be negative.")
            except (ValueError, TypeError):
                raise serializers.ValidationError(f"Item {idx + 1}: invalid price format.")
        
        return value

    def _generate_invoice_number(self):
        return f"CS{str(uuid.uuid4())[:8].upper()}"

    def create(self, validated_data):
        items_data = validated_data.pop("item_inputs", [])
        if not items_data:
            raise serializers.ValidationError("At least one item is required to create a sale.")

        # Enforce posted_by_username
        posted_by_username = validated_data.pop("posted_by_username", None)
        if not posted_by_username:
            raise serializers.ValidationError("posted_by_username is required.")

        try:
            posted_by_user = User.objects.get(username=posted_by_username)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User '{posted_by_username}' does not exist.")

        #  Role check via UserProfile
        try:
            profile = UserProfile.objects.get(user=posted_by_user)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError(f"User '{posted_by_username}' has no profile.")

        if profile.role.lower() != "sales":
            # raise serializers.ValidationError(f"User '{posted_by_username}' is not authorized to post sales.")
            raise serializers.ValidationError("User is not authorized to post sales.")


        branch = validated_data.pop("branch", None)

        # Compute total_amount
        total_amount = Decimal("0.00")
        for item_data in items_data:
            price = safe_quantize(Decimal(str(item_data.get("price", 0))))
            quantity = int(item_data.get("quantity", 1))
            discount = safe_quantize(Decimal(str(item_data.get("discount", 0))))
            
            item_total = (price * quantity) - discount
            total_amount += item_total

        sale = Sale.objects.create(
            customer_name=validated_data.get("customer_name", "Walk-in"),
            total_amount=safe_quantize(total_amount),
            invoice_number=self._generate_invoice_number(),
            posted_by=posted_by_user,
            branch=branch,
        )

        # Create SaleItems
        for item_data in items_data:
            product_ref = item_data.get("product")
            try:
                if isinstance(product_ref, int) or str(product_ref).isdigit():
                    product = Product.objects.get(id=int(product_ref))
                else:
                    product = Product.objects.get(name=product_ref)
            except Product.DoesNotExist:
                sale.delete()  # Rollback sale if product not found
                raise serializers.ValidationError(f"Product '{product_ref}' does not exist.")

            quantity = int(item_data.get("quantity", 1))
            
            # Check stock availability
            if hasattr(product, "quantity"):
                if product.quantity < quantity:
                    sale.delete()  # Rollback sale if insufficient stock
                    raise serializers.ValidationError(f"Insufficient stock for {product.name}. Available: {product.quantity}, Requested: {quantity}.")
                product.quantity -= quantity
                product.save()

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit=item_data.get("unit", "pcs"),
                price=safe_quantize(Decimal(str(item_data.get("price", 0)))),
                vat=safe_quantize(Decimal(str(item_data.get("vat", "16.00")))),
                discount=safe_quantize(Decimal(str(item_data.get("discount", 0)))),
            )

        return sale


# ---------- Customer Serializer ----------
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
