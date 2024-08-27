from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets,generics
from rest_framework.response import Response
from rest_framework.decorators import action,api_view
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, UserProfileSerializer
from authentication.serializers import UserProfileSerializer as AuthUserProfileSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from authentication.models import *
from rest_framework.parsers import MultiPartParser,FormParser
from django.db.models import Q

class PostCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request):
        user_id = request.data.get('user_id')
        if user_id is None:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(id=user_id)
        except user.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Add created_by to the payload
        # request.data._mutable = True  # Make request data mutable (if needed)
        request.data['created_by'] = user.id
        
        user.post_no+=1
        userserializer=AuthUserProfileSerializer(data=user)

        if userserializer.is_valid():
            userserializer.save()

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
        
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class =PostSerializer

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'  # or use a different field if needed




@api_view(['POST'])
def like_post(request):
    # Extract post_id and user_id from the request data
    post_id = request.data.get('post_id')
    user_id = request.data.get('user_id')

    if not post_id:
        return Response({'error': 'Post ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        user = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if user in post.likes.all():
        post.likes.remove(user)
        return Response({'message': 'Post disliked successfully'}, status=status.HTTP_200_OK)

    post.likes.add(user)
    return Response({'message': 'Post liked successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_comment(request):
    """
    Add a comment to a specific post based on user_id and post_id provided in the request data.
    """
    user_id = request.data.get('user_id')
    post_id = request.data.get('post_id')
    content = request.data.get('content')

    try:
        user = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create and save the comment
    comment = Comment(user=user, post=post, content=content)
    comment.save()

    # Serialize the comment and return the response
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_comments(request, post_id):
    """
    Get all comments for a specific post.
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    comments = Comment.objects.filter(post_id=post.id).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search_view(request):
    query = request.GET.get('q', '')

    if not query:
        return Response({"error": "Search query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Search in Post model
    posts = Post.objects.filter(
        Q(title__icontains=query) |
        Q(content__icontains=query) |
        Q(category__icontains=query) 
    )

    # Search in UserProfile model
    users = UserProfile.objects.filter(
        Q(username__icontains=query) |
        Q(email__icontains=query)   
    )

    # Serialize results
    post_serializer = PostSerializer(posts, many=True)
    user_serializer = AuthUserProfileSerializer(users, many=True)

    # Combine results
    results = {
        'posts': post_serializer.data,
        'users': user_serializer.data
    }

    return Response(results, status=status.HTTP_200_OK)


@api_view(['GET'])
def exclude_post_view(request, user_id):
    try:
        # Fetch all posts and order them by newest first
        queryset = Post.objects.all().order_by('-created_at')
        
        # Exclude posts created by the given user_id
        queryset = queryset.exclude(created_by=user_id)
        
        # Process the queryset to include full URLs for post_photo
        data = []
        for post in queryset:
            post_data = PostSerializer(post).data
            if post.post_photo:
                # Build the absolute URL for post_photo
                post_data['post_photo'] = request.build_absolute_uri(post.post_photo.url)
            data.append(post_data)
        
        # Return the processed data as a response
        return Response(data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)