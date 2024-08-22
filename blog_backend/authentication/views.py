# authentication/views.py
from rest_framework import viewsets
# from django.contrib.auth import get_user_model
from .models import UserProfile

from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer


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