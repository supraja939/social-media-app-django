from django.urls import path
from .views import  edit_profile, login, register, profile, toggle_follow, people_list, following_list

urlpatterns = [
    path('register/', register),
    path('login/', login),
     path('profile/', profile),
    path('edit-profile/', edit_profile),
    path('follow/<int:user_id>/', toggle_follow),
    path('people/', people_list),
    path('following/', following_list),

]