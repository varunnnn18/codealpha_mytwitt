from django.urls import path
from .views import signup, login, profile, create_tweet, get_tweets,like_tweet, delete_tweet,add_comment, get_comments,user_profile,follow_user,list_users, search_users

urlpatterns = [
    path("signup/", signup),
    path("login/", login),
    path("profile/", profile),
    path("tweet/", create_tweet),
    path("tweets/", get_tweets),
    path("tweet/<int:tweet_id>/like/", like_tweet),
    path("tweet/<int:tweet_id>/delete/", delete_tweet),
    path("tweet/<int:tweet_id>/comment/", add_comment),
    path("tweet/<int:tweet_id>/comments/", get_comments),
    path("profile/<int:user_id>/", user_profile),
    path("follow/<int:user_id>/", follow_user),
    path("users/", list_users),
    path("users/search/", search_users),
]
