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
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from decimal import Decimal
from sales.models import Sale, Customer
from cashier.models import PaymentRecord
from adminpanel.models import UserProfile
from cashier.serializers import PaymentRecordSerializer
from .serializers import SaleSerializer, CustomerSerializer
from .utils import format_invoice
from adminpanel.models import Branch
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

class AuthorizeSaleView(APIView):
    """
    Endpoint to verify a user's credentials before authorizing a sale.
    """

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"success": False, "message": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {"success": False, "message": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # If valid, return both success and user info
        return Response(
            {
                "success": True,
                "username": user.username,   # human‑readable name
                "user_id": user.id           # optional: keep ID if you need to set ForeignKey
            },
            status=status.HTTP_200_OK
        )


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


class SaleListCreateView(FriendlyErrorMixin, generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [AllowAny]   # no login required

    def create(self, request, *args, **kwargs):
        try:
            # Log incoming data for debugging
            print("Incoming sale data:", request.data)
            
            # Validate serializer (branch validation happens in serializer)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Create sale (serializer handles posted_by + role check)
            sale = serializer.save()

            # Auto-create payment record
            PaymentRecord.objects.get_or_create(
                sale=sale,
                defaults={
                    "payment_mode": "mpesa",
                    "status": "pending",
                    "amount_paid": Decimal("0.00"),
                }
            )

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except serializers.ValidationError as e:
            print("Validation error:", e.detail)
            return Response({"error": str(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("FULL ERROR:")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"Failed to create sale: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
