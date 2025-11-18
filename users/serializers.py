# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         # Add custom claims
#         # If role is in UserProfile:
#         token['role'] = user.userprofile.role  
#         # Or if role is directly on User:
#         # token['role'] = user.role  

#         return token

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         # If superuser, force role = "admin"
#         if self.user.is_superuser:
#             data['role'] = 'admin'
#         else:
#             # If you store role in UserProfile
#             data['role'] = getattr(self.user.userprofile, 'role', 'user')

#         return data

