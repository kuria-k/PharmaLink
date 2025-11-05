from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Branch, UserProfile

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'location']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    branches = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), many=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'branches', 'role']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        branches = validated_data.pop('branches')
        user = User.objects.create_user(**user_data)
        profile = UserProfile.objects.create(user=user, role=validated_data['role'])
        profile.branches.set(branches)
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        branches = validated_data.pop('branches', None)

        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.email = user_data.get('email', user.email)
            password = user_data.get('password', None)
            if password:
                user.set_password(password)
            user.save()

        if branches is not None:
            instance.branches.set(branches)

        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
