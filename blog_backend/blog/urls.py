from django.urls import path
from blog_backend import settings
from .views import PostCreateView, PostDetailView,PostListView, add_comment, get_comments,like_post, search_view,exclude_post_view
from django.conf.urls.static import static


urlpatterns = [
    path('post/create/', PostCreateView.as_view(), name='post-create'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('posts/<int:id>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/like/', like_post, name='like-post'),
    path('posts/<int:post_id>/comments/', get_comments, name='get_comments'),
    path('comments/add/', add_comment, name='add_comment'),
    path('search/', search_view, name='search'),
    path('posts/exclude/<int:user_id>', exclude_post_view, name='exclude_post_view'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
