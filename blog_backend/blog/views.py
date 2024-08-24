from rest_framework import viewsets
from .models import Post
# from authentication.models import UserProfile
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
