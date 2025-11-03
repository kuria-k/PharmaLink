from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Sale
from .serializers import SaleSerializer
from .utils import format_invoice

# List and Create Sales
class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

# Retrieve a Single Sale
class SaleDetailView(generics.RetrieveAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    lookup_field = 'pk'

# Generate Invoice for a Sale
class SaleInvoiceView(APIView):
    def get(self, request, pk):
        try:
            sale = Sale.objects.get(pk=pk)
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

        invoice = format_invoice(sale)
        return Response(invoice)

