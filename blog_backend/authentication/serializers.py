from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password']

    # def create(self, validated_data):
    #     user = User.objects.create_user(
    #         username=validated_data['username'],
    #         email=validated_data['email'],
    #         password=validated_data['password']
    #     )
    #     return user
