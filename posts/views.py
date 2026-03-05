from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Post, Like



# ==============================
# 🔹 CREATE POST
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):

    # get data from request
    caption = request.data.get("caption")
    image = request.FILES.get("image")

    # validate image
    if not image:
        return Response(
            {"error": "Image is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # create post
    post = Post.objects.create(
        user=request.user,
        caption=caption,
        image=image
    )

    return Response(
        {
            "message": "Post created successfully",
            "post_id": post.id
        },
        status=status.HTTP_201_CREATED
    )








@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_posts(request):

    posts = Post.objects.all().order_by('-created_at')

    data = []

    for post in posts:

        likes_count = Like.objects.filter(post=post).count()

        data.append({
            "id": post.id,
            "username": post.user.username,
            "image": post.image.url,
            "caption": post.caption,
            "likes": likes_count
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_posts(request):

    posts = Post.objects.filter(user=request.user).order_by('-created_at')

    data = []

    for post in posts:

        likes_count = Like.objects.filter(post=post).count()

        data.append({
            "id": post.id,
            "username": post.user.username,
            "image": post.image.url,
            "caption": post.caption,
            "likes": likes_count
        })
        
    return Response(data)


# 🔹 DELETE POST
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):

    post = get_object_or_404(Post, id=post_id, user=request.user)

    post.delete()

    return Response({"message": "Post deleted"})



# 🔹 UPDATE POST
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, post_id):

    post = get_object_or_404(Post, id=post_id, user=request.user)

    caption = request.data.get("caption")

    if caption is not None:
        post.caption = caption
        post.save()

    return Response({"message": "Post updated"})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):

    post = get_object_or_404(Post, id=post_id)

    like = Like.objects.filter(user=request.user, post=post)

    if like.exists():
        like.delete()
        return Response({"message": "Unliked"})
    else:
        Like.objects.create(user=request.user, post=post)
        return Response({"message": "Liked"})