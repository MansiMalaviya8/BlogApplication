from rest_framework import serializers
from .models import Post, Comment
from authentication.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username','post_no']  # Adjust fields as necessary

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()  # Nested serializer for the user

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)  # Serialize related comments
    likes = UserProfileSerializer(many=True, read_only=True)  # Serialize related likes
    created_by_username = serializers.SerializerMethodField()
    # created_by_profile=serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'category', 'created_by', 'created_at', 'updated_at', 'likes','comments','post_photo','created_by_username']

    def get_created_by_username(self, obj):
        return obj.created_by.username
    
    # def get_created_by_profile(self, obj):
    #     if obj.created_by.profile_photo:
    #         return obj.created_by.profile_photo.url
    #     return 'C:\Projects\blog_frontend\public\default_profile.jpg'