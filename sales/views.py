# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, generics,viewsets
# from sales.models import Sale, Customer
# from .serializers import SaleSerializer, CustomerSerializer
# from .utils import format_invoice

# # List and Create Sales
# class SaleListCreateView(generics.ListCreateAPIView):
#     queryset = Sale.objects.all()
#     serializer_class = SaleSerializer

# # Retrieve a Single Sale
# class SaleDetailView(generics.RetrieveAPIView):
#     queryset = Sale.objects.all()
#     serializer_class = SaleSerializer
#     lookup_field = 'pk'

# # Generate Invoice for a Sale
# class SaleInvoiceView(APIView):
#     def get(self, request, pk):
#         try:
#             sale = Sale.objects.get(pk=pk)
#         except Sale.DoesNotExist:
#             return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

#         invoice = format_invoice(sale)
#         return Response(invoice)
    

# # List all customers or create a new one
# class CustomerListCreateView(generics.ListCreateAPIView):
#     queryset = Customer.objects.all()
#     serializer_class = CustomerSerializer

# # Retrieve, update, or delete a single customer
# class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Customer.objects.all()
#     serializer_class = CustomerSerializer



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from sales.models import Sale, Customer
from cashier.models import PaymentRecord
from cashier.serializers import PaymentRecordSerializer
from .serializers import SaleSerializer, CustomerSerializer
from .utils import format_invoice


class FriendlyErrorMixin:
    """Mixin to format serializer and validation errors into user-friendly responses."""

    def handle_exception(self, exc):
        response = super().handle_exception(exc)
        if response is not None and isinstance(response.data, dict):
            # Flatten serializer errors into readable messages
            friendly_errors = []
            for field, errors in response.data.items():
                if isinstance(errors, list):
                    for err in errors:
                        friendly_errors.append(f"{field}: {err}")
                else:
                    friendly_errors.append(f"{field}: {errors}")
            response.data = {
                "success": False,
                "errors": friendly_errors,
                "message": "There was a problem with your request. Please review the details."
            }
        return response


# List and Create Sales
class SaleListCreateView(FriendlyErrorMixin, generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    def perform_create(self, serializer):
        # Save the sale first
        sale = serializer.save()

        # Automatically create a pending PaymentRecord
        PaymentRecord.objects.get_or_create(
            sale=sale,
            defaults={
                "payment_mode": "mpesa",   # or "cash" depending on your default
                "status": "pending",
                "amount_paid": 0,
            }
        )


# Retrieve a Single Sale
class SaleDetailView(FriendlyErrorMixin, generics.RetrieveAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    lookup_field = 'pk'


# Generate Invoice for a Sale
class SaleInvoiceView(APIView):
    def get(self, request, pk):
        try:
            sale = Sale.objects.get(pk=pk)
        except Sale.DoesNotExist:
            return Response(
                {"success": False, "message": "Sale not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        invoice = format_invoice(sale)
        return Response({"success": True, "invoice": invoice})


# List all customers or create a new one
class CustomerListCreateView(FriendlyErrorMixin, generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


# Retrieve, update, or delete a single customer
class CustomerDetailView(FriendlyErrorMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
