from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import UserProfile, Follow
from rest_framework.permissions import IsAuthenticated

# Create your views here.
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
   
    return Response({"message": "User created successfully"}, status=201)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    })

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserProfile

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):

    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)

    profile_picture = None
    if profile.profile_picture:
        profile_picture = request.build_absolute_uri(profile.profile_picture.url)

    return Response({
        "username": user.username,
        "bio": profile.bio,
        "profile_picture": profile_picture,
        "posts": 0,
        "followers": user.followers.count(),
        "following": user.following.count(),
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):

    user = request.user
    profile = UserProfile.objects.get(user=user)

    username = request.data.get("username")
    bio = request.data.get("bio")
    profile_picture = request.FILES.get("profile_picture")

    if username:
        user.username = username
        user.save()

    if bio is not None:
        profile.bio = bio

    if profile_picture:
        profile.profile_picture = profile_picture

    profile.save()

    return Response({"message": "Profile Updated"})



# ==================   ============
# 🔹 FOLLOW / UNFOLLOW TOGGLE
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, user_id):

    target_user = get_object_or_404(User, id=user_id)

    if request.user == target_user:
        return Response({"error": "Cannot follow yourself"})

    # Check if already following
    existing_follow = Follow.objects.filter(
        follower=request.user,
        following=target_user
    )

    if existing_follow.exists():
        existing_follow.delete()
        return Response({"message": "Unfollowed"})
    else:
        Follow.objects.create(
            follower=request.user,
            following=target_user
        )
        return Response({"message": "Followed"})


# ==============================
# 🔹 PEOPLE LIST (NOT FOLLOWED)
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def people_list(request):

    followed_users = Follow.objects.filter(
        follower=request.user
    ).values_list('following_id', flat=True)

    users = User.objects.exclude(
        id__in=followed_users
    ).exclude(
        id=request.user.id
    )

    data = []

    for user in users:
        data.append({
            "id": user.id,
            "username": user.username
        })

    return Response(data)


# ==============================
# 🔹 FOLLOWING LIST
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def following_list(request):

    follows = Follow.objects.filter(follower=request.user)

    data = []

    for follow in follows:
        data.append({
            "id": follow.following.id,
            "username": follow.following.username
        })

    return Response(data)


