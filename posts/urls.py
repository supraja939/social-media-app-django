from django.urls import path
from . import views

urlpatterns = [

    # 🔹 Create Post
    path('create/', views.create_post, name='create_post'),

    # 🔹 Feed (all posts for home page)
    path('feed/', views.feed_posts, name='feed_posts'),

    # 🔹 My posts (profile page)
    path('my/', views.my_posts, name='my_posts'),
     
    path('delete/<int:post_id>/', views.delete_post),

    path('update/<int:post_id>/', views.update_post),
    path('like/<int:post_id>/', views.toggle_like),
     
]