from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'post_no', 'followers', 'following_profiles', 'profile_photo', 'followers_count', 'following_count']

    def get_followers_count(self, obj):
        return obj.get_followers_count()

    def get_following_count(self, obj):
        return obj.get_following_count()
    

from rest_framework import serializers
from .models import FollowersKeys

class FollowersKeysSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowersKeys
        fields = ['user_id', 'following_user_id']