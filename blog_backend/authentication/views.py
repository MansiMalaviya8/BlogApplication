# authentication/views.py
from rest_framework import viewsets,generics
from .models import FollowersKeys, UserProfile
from rest_framework.decorators import action,api_view
from .serializers import FollowersKeysSerializer, UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.permissions import AllowAny

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def toggle_follow(request):
    # Extract user IDs from the request data
    user_id = request.data.get('user_id')
    following_user_id = request.data.get('following_user_id')
    
    # Ensure both user IDs are provided
    if not user_id or not following_user_id:
        return Response({"error": "Both user_id and following_user_id are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user_id and following_user_id are the same
    if user_id == following_user_id:
        return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Retrieve user profiles based on the IDs
        user = UserProfile.objects.get(id=user_id)
        following_user = UserProfile.objects.get(id=following_user_id)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the follow relationship exists
    follow_relationship = FollowersKeys.objects.filter(
        user_id=user,
        following_user_id=following_user
    ).first()
    
    if follow_relationship:
        # If relationship exists, delete it (unfollow)
        follow_relationship.delete()
        action = 'unfollowed'
    else:
        # If relationship does not exist, create it (follow)
        FollowersKeys.objects.create(
            user_id=user,
            following_user_id=following_user
        )
        action = 'followed'
    
    return Response({'action': action}, status=status.HTTP_200_OK)

class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class LoginView(APIView):
    # permission_classes = [AllowAny]
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
            # 'refresh': str(refresh),
            'user_id': user.id,
            'username': user.username,})
    
class RegisterView(APIView):
    # permission_classes = [AllowAny]
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
        serializer = UserProfileSerializer(user)
        return Response({'message': 'User registered successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_follow_counts(request, user_id):
    try:
        # Retrieve user profile based on the ID
        user = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate follower count and following count
    following_count = FollowersKeys.objects.filter(following_user_id=user).count()
    follower_count = FollowersKeys.objects.filter(user_id=user).count()
    
    return Response({
        'follower_count': follower_count,
        'following_count': following_count
    }, status=status.HTTP_200_OK)