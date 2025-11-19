# from rest_framework import generics, status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.viewsets import ModelViewSet
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.models import User
# from .models import Branch, UserProfile
# from .serializers import ( BranchSerializer, UserSerializer, UserProfileSerializer, ChangePasswordSerializer)
# # from users.permissions import IsAdmin  

# # class AdminDashboardView(APIView):
# #     permission_classes = [IsAdmin]

# #     def get(self, request):
# #         return Response({"message": "Welcome Admin"})

# # class BranchViewSet(ModelViewSet):
# #     queryset = Branch.objects.all()
# #     serializer_class = BranchSerializer
# class BranchListCreateView(generics.ListCreateAPIView):
#     queryset = Branch.objects.all()
#     serializer_class = BranchSerializer

# class BranchDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Branch.objects.all()
#     serializer_class = BranchSerializer

# class UserListCreateView(generics.ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class UserProfileListCreateView(generics.ListCreateAPIView):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer

# class UserProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer

# class ChangePasswordView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = ChangePasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             new_password = serializer.validated_data['new_password']
#             request.user.set_password(new_password)
#             request.user.save()
#             return Response({'status': 'Password updated successfully'})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Branch, UserProfile, Sale, Product
from .serializers import (
    BranchSerializer,
    UserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    ProductSerializer,
    SaleSerializer
)

# Branch Views
class BranchListCreateView(generics.ListCreateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class BranchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

# Products
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# Sales
class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

# User Views
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# UserProfile Views
class UserProfileListCreateView(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# Change Password
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not request.user.check_password(old_password):
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            request.user.set_password(new_password)
            request.user.save()
            return Response({'status': 'Password updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



  
