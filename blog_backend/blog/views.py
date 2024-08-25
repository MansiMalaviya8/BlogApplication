from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets,generics
from rest_framework.response import Response
from rest_framework.decorators import action,api_view
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
# from django.shortcuts import get_object_or_404
# from django.contrib.auth import get_user_model
from authentication.models import *
from rest_framework.parsers import MultiPartParser,FormParser

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
        userserializer=UserProfileSerializer(data=user)

        if userserializer.is_valid():
            userserializer.save()

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
        
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class =PostSerializer

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'  # or use a different field if needed

# class CreatePostView(APIView):
#     permission_classes = [IsAuthenticated]  # Ensure that the user is authenticated

#     def post(self, request, *args, **kwargs):
#         data = request.data.copy()
#         data['created_by'] = request.user.id  # Automatically set the creator of the post
#         serializer = PostSerializer(data=data)
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        if post_id:
            post = Post.objects.get(id=post_id)
            serializer.save(user=self.request.user, post=post)
        else:
            raise ValueError("Post ID is required to create a comment")