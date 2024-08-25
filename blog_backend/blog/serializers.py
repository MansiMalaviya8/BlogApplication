from rest_framework import serializers
from .models import Post, Comment
from authentication.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username']  # Adjust fields as necessary

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()  # Nested serializer for the user

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    # created_by = UserProfileSerializer()  # Nested serializer for the creator
    comments = CommentSerializer(many=True, read_only=True)  # Serialize related comments
    likes = UserProfileSerializer(many=True, read_only=True)  # Serialize related likes
    created_by_username = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'category', 'created_by', 'created_at', 'updated_at', 'likes','comments','post_photo','created_by_username']

    def get_created_by_username(self, obj):
        return obj.created_by.username