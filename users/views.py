from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Tweet
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Tweet, Comment
from django.contrib.auth.models import User
from .models import Follow



# Create your views here.
@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=email).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )
    return Response({"message": "User created successfully"})

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "message": "Login successful"
    })
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response({
        "email": request.user.email
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_tweet(request):
    content = request.data.get('content')

    if not content:
        return Response({"error": "Tweet cannot be empty"}, status=400)

    tweet = Tweet.objects.create(
        user=request.user,
        content=content
    )

    return Response({"message": "Tweet posted"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tweets(request):
    tweets = Tweet.objects.all().order_by('-created_at')

    data = []
    for tweet in tweets:
        data.append({
            "id": tweet.id,
            "user": tweet.user.email,
            "user_id": tweet.user.id,
            "content": tweet.content,
            "likes": tweet.likes.count(),
            "liked": request.user in tweet.likes.all(),
            "is_owner": tweet.user == request.user,
            "created_at": tweet.created_at
        })

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_tweet(request, tweet_id):
    tweet = get_object_or_404(Tweet, id=tweet_id)

    if request.user in tweet.likes.all():
        tweet.likes.remove(request.user)
        return Response({"message": "Unliked"})
    else:
        tweet.likes.add(request.user)
        return Response({"message": "Liked"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_tweet(request, tweet_id):
    tweet = get_object_or_404(Tweet, id=tweet_id)

    if tweet.user != request.user:
        return Response({"error": "Not allowed"}, status=403)

    tweet.delete()
    return Response({"message": "Tweet deleted"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, tweet_id):
    tweet = get_object_or_404(Tweet, id=tweet_id)
    content = request.data.get("content")

    if not content:
        return Response({"error": "Comment cannot be empty"}, status=400)

    Comment.objects.create(
        tweet=tweet,
        user=request.user,
        content=content
    )

    return Response({"message": "Comment added"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comments(request, tweet_id):
    tweet = get_object_or_404(Tweet, id=tweet_id)

    data = []
    for c in tweet.comments.all().order_by("created_at"):
        data.append({
            "user": c.user.email,
            "content": c.content,
            "created_at": c.created_at
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    tweets = Tweet.objects.filter(user=user).order_by('-created_at')

    is_following = Follow.objects.filter(
        follower=request.user,
        following=user
    ).exists()

    data = {
        "email": user.email,
        "tweets_count": tweets.count(),
        "followers": user.followers.count(),
        "following": user.following.count(),
        "is_following": is_following,
        "is_self": request.user == user,
        "tweets": [
            {
                "id": t.id,
                "content": t.content,
                "likes": t.likes.count(),
                "created_at": t.created_at,
            }
            for t in tweets
        ]
    }

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    if request.user.id == user_id:
        return Response({"error": "You cannot follow yourself"}, status=400)

    user_to_follow = get_object_or_404(User, id=user_id)

    follow, created = Follow.objects.get_or_create(
        follower=request.user,
        following=user_to_follow
    )

    if not created:
        follow.delete()
        return Response({"message": "Unfollowed"})

    return Response({"message": "Followed"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.exclude(id=request.user.id)

    data = []
    for user in users:
        data.append({
            "id": user.id,
            "email": user.email,
            "followers": user.followers.count(),
            "is_following": Follow.objects.filter(
                follower=request.user,
                following=user
            ).exists()
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get("q", "")
    users = User.objects.filter(
        email__icontains=query
    ).exclude(id=request.user.id)

    return Response([
        {
            "id": u.id,
            "email": u.email
        }
        for u in users
    ])
