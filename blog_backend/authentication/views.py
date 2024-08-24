# authentication/views.py
from rest_framework import viewsets
from .models import UserProfile
from rest_framework.decorators import action
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    @action(detail=True, methods=['post'])
    def toggle_follow(self, request, pk=None):
        user_to_toggle = self.get_object()  # The user profile to follow/unfollow
        current_user = request.user  # The user performing the action

        if user_to_toggle == current_user:
            return Response({"detail": "You cannot follow/unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        if current_user in user_to_toggle.followers.all():
            # User is currently following, so we need to unfollow
            user_to_toggle.followers.remove(current_user)
            current_user.following_profiles.remove(user_to_toggle)
            return Response({"detail": "User unfollowed successfully."}, status=status.HTTP_200_OK)
        else:
            # User is not currently following, so we need to follow
            user_to_toggle.followers.add(current_user)
            current_user.following_profiles.add(user_to_toggle)
            return Response({"detail": "User followed successfully."}, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = UserProfile.objects.get(username=username)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)})
    
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return Response({'error': 'Username, email, and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if UserProfile.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if UserProfile.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Hash the password
        hashed_password = make_password(password)
        
        # Create a new user
        user = UserProfile(username=username, email=email, password=hashed_password)
        user.save()
        
        # Optionally return the user details or a success message
        serializer = UserSerializer(user)
        return Response({'message': 'User registered successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)