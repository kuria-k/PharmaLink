from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import F
from django.utils import timezone

from .models import Product, Batch, PurchaseOrder, Supplier
from .serializers import (
    ProductSerializer,
    BatchSerializer,
    PurchaseOrderSerializer,
    SupplierSerializer
)

class ProductValuationView(APIView):
    def get(self, request):
        products = Product.objects.all()
        data = []
        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "quantity": p.quantity,
                "costPrice": float(p.price_per_pack),  
                "sellingPrice": float(p.selling_price_per_pack or p.price_per_pack),  
            })
        return Response(data)

class AddOrUpdateProductView(APIView):
    def post(self, request):
        data = request.data
        sku = data.get("sku")

        try:
            product = Product.objects.get(sku=sku)

            # increment quantity safely
            increment = int(data.get("quantity", 0))
            Product.objects.filter(pk=product.pk).update(quantity=F("quantity") + increment)

            # update other fields if provided
            if data.get("price_per_pack") is not None:
                product.price_per_pack = data["price_per_pack"]
            if data.get("price_per_piece") is not None:
                product.price_per_piece = data["price_per_piece"]
            if data.get("selling_price_per_pack") is not None:
                product.selling_price_per_pack = data["selling_price_per_pack"]
            if data.get("selling_price_per_piece") is not None:
                product.selling_price_per_piece = data["selling_price_per_piece"]

            product.save()
            product.refresh_from_db()  

            return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            serializer = ProductSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.all().order_by("-received")
    serializer_class = BatchSerializer


class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer


class BatchFromCompletedView(APIView):
    def post(self, request):
        from django.utils import timezone

        completed_orders = PurchaseOrder.objects.filter(status="completed", batched=False)
        if not completed_orders.exists():
            return Response({"detail": "No unbatched completed purchase orders found."}, status=status.HTTP_400_BAD_REQUEST)

        first_order = completed_orders.first()
        batch = Batch.objects.create(
            product=first_order.product,
            supplier=first_order.supplier,
            received=timezone.now().date(),
            quantity=sum(o.quantity for o in completed_orders),
        )
        batch.orders.set(completed_orders)

        
        completed_orders.update(batched=True)

        return Response({
            "batch": BatchSerializer(batch).data,
            "orders": PurchaseOrderSerializer(completed_orders, many=True).data
        }, status=status.HTTP_201_CREATED)


class InventorySummaryView(APIView):
    def get(self, request, format=None):
        products = Product.objects.all()
        total_products = products.count()

        # Calculate inventory value
        inventory_value = sum([
            p.quantity * (p.price_per_pack if p.unit_type == "pack"
                          else p.get_piece_price())
            for p in products
        ])

        # Low stock items
        low_stock_qs = products.filter(quantity__lt=F("safety_stock"))
        low_stock_items = low_stock_qs.count()

        low_stock_list = [
            {"name": p.name, "sku": p.sku, "available": p.quantity}
            for p in low_stock_qs
        ]

        return Response({
            "total_products": total_products,
            "inventory_value": inventory_value,
            "low_stock_items": low_stock_items,
            "low_stock_list": low_stock_list,
        })


class PurchaseOrderListCreateView(generics.ListCreateAPIView):
    queryset = PurchaseOrder.objects.all().order_by("-order_date")
    serializer_class = PurchaseOrderSerializer


class PurchaseOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer


class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all().order_by("name")
    serializer_class = SupplierSerializer


class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

