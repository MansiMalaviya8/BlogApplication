from django.urls import path, include
from rest_framework.routers import DefaultRouter

from blog_backend import settings
from .views import CommentViewSet,PostCreateView, PostDetailView,PostListView,like_post
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'comment',CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('post/create/', PostCreateView.as_view(), name='post-create'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:id>/', PostDetailView.as_view(), name='post-detail'),
    # path('posts/create', CreatePostView.as_view(), name='create_post'),
    path('posts/like/', like_post, name='like-post'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
