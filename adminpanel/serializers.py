# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import Branch, UserProfile

# class BranchSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Branch
#         fields = ['id', 'name', 'location']

# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password']

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password']
#         )
#         return user

# class UserProfileSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     branches = BranchSerializer(many=True, read_only=True)
#     branch_ids = serializers.PrimaryKeyRelatedField(
#         queryset=Branch.objects.all(),
#         many=True,
#         write_only=True,
#         source='branches'
#     )

#     class Meta:
#         model = UserProfile
#         fields = ['id', 'user', 'branches', 'branch_ids', 'role']
#         extra_kwargs = {
#             'id': {'read_only': True}   # 👈 makes id not required
#         }

#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         branches = validated_data.pop('branches', [])
#         user = User.objects.create_user(**user_data)
#         profile = UserProfile.objects.create(user=user, role=validated_data['role'])
#         profile.branches.set(branches)
#         return profile

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop('user', None)
#         branches = validated_data.pop('branches', None)

#         if user_data:
#             user = instance.user
#             user.username = user_data.get('username', user.username)
#             user.email = user_data.get('email', user.email)
#             password = user_data.get('password', None)
#             if password:
#                 user.set_password(password)
#             user.save()

#         if branches is not None:
#             instance.branches.set(branches)

#         instance.role = validated_data.get('role', instance.role)
#         instance.save()
#         return instance


# class ChangePasswordSerializer(serializers.Serializer):
#     new_password = serializers.CharField(write_only=True)


# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import Branch, UserProfile

# class BranchSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Branch
#         fields = ['id', 'name', 'location']


# class UserSerializer(serializers.ModelSerializer):
#     # Password is optional on update, required only on create
#     password = serializers.CharField(write_only=True, required=False)

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password']
#         extra_kwargs = {
#             'username': {'required': False},  # not required on update
#             'email': {'required': False},     # not required on update
#         }

#     def create(self, validated_data):
#         return User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data.get('email', ''),
#             password=validated_data['password']
#         )


# class UserProfileSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     branches = BranchSerializer(many=True, read_only=True)
#     branch_ids = serializers.PrimaryKeyRelatedField(
#         queryset=Branch.objects.all(),
#         many=True,
#         write_only=True,
#         source='branches',
#         required=False   # optional
#     )

#     class Meta:
#         model = UserProfile
#         fields = ['id', 'user', 'branches', 'branch_ids', 'role']
#         extra_kwargs = {
#             'id': {'read_only': True}
#         }

#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         branches = validated_data.pop('branches', [])
#         user = User.objects.create_user(**user_data)
#         profile = UserProfile.objects.create(user=user, role=validated_data['role'])
#         profile.branches.set(branches)
#         return profile

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop('user', None)
#         branches = validated_data.pop('branches', None)

#         if user_data:
#             user = instance.user
#         # Only update fields if provided
#             if 'username' in user_data:
#                 user.username = user_data['username']
#             if 'email' in user_data:
#                 user.email = user_data['email']
#             if 'password' in user_data and user_data['password']:
#                 user.set_password(user_data['password'])
#             user.save()

#         if branches is not None:
#             instance.branches.set(branches)

#         if 'role' in validated_data:
#             instance.role = validated_data['role']

#         instance.save()
#         return instance


# class ChangePasswordSerializer(serializers.Serializer):
#     new_password = serializers.CharField(write_only=True)


from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Branch, UserProfile, Product

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'location']


class UserSerializer(serializers.ModelSerializer):
    # Password is optional on update, required only on create
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'username': {'required': True},  
            'email': {'required': False},
        }

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'sku', 'name', 'quantity', 'price_per_pack']


class UserProfileSerializer(serializers.ModelSerializer):
    # Nested user serializer (writable for create/update)
    user = UserSerializer()

    branches = BranchSerializer(many=True, read_only=True)
    branch_ids = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(),
        many=True,
        write_only=True,
        source='branches',
        required=False
    )

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'branches', 'branch_ids', 'role']
        extra_kwargs = {
            'id': {'read_only': True}
        }

    def create(self, validated_data):
        # Extract nested user data
        user_data = validated_data.pop('user')
        branch_data = validated_data.pop('branches', [])

        # Create user
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            password=user_data.get('password')
        )

        # Create profile
        profile = UserProfile.objects.create(user=user, role=validated_data.get('role'))

        # Assign branches if provided
        if branch_data:
            profile.branches.set(branch_data)

        return profile

    def update(self, instance, validated_data):
        # Handle nested user updates
        user_data = validated_data.pop('user', None)
        branches = validated_data.pop('branches', None)

        if user_data:
            user = instance.user
            if 'username' in user_data:
                user.username = user_data['username']
            if 'email' in user_data:
                user.email = user_data['email']
            if 'password' in user_data and user_data['password']:
                user.set_password(user_data['password'])
            user.save()

        if branches is not None:
            instance.branches.set(branches)

        if 'role' in validated_data:
            instance.role = validated_data['role']

        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

