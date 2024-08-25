from django.urls import path, include
from rest_framework.routers import DefaultRouter

from blog_backend import settings
from .views import UserProfileDetailView, UserProfileViewSet,LoginView,RegisterView, get_follow_counts, toggle_follow
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/<int:pk>/', UserProfileDetailView.as_view(), name='user-detail'),
    path('toggle-follow/', toggle_follow, name='toggle-follow'),
    path('get-follow-counts/<int:user_id>/', get_follow_counts, name='get-follow-counts'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
