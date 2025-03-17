from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from .models import Friend
from .serializers import FriendSerializer, UserSerializer

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request, user_id=None):
    """
    List all *accepted* friends for the specified user (status=1).
    If user_id is not given, list friends for the current user.
    """
    if user_id:
        user = get_object_or_404(User, id=user_id)
    else:
        user = request.user

    friendships = Friend.objects.filter(
        Q(from_user=user) | Q(to_user=user),
        status=1
    )

    friend_users = []
    for f in friendships:
        friend = f.to_user if f.from_user == user else f.from_user
        friend_users.append(friend)

    serializer = UserSerializer(friend_users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_sent_requests(request):
    """
    List friend requests the current user has sent (pending only).
    """
    sent_requests = Friend.objects.filter(from_user=request.user, status=0)
    serializer = FriendSerializer(sent_requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_received_requests(request):
    """
    List friend requests the current user has received (pending only).
    """
    received_requests = Friend.objects.filter(to_user=request.user, status=0)
    serializer = FriendSerializer(received_requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    """
    Current user (request.user) sends a friend request to another user (to_user_id).
    """
    to_user_id = request.data.get('to_user_id')
    if not to_user_id:
        return Response(
            {"detail": "to_user_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    to_user = get_object_or_404(User, id=to_user_id)


    if to_user == request.user:
        return Response(
            {"detail": "You cannot send a friend request to yourself."},
            status=status.HTTP_400_BAD_REQUEST
        )

    existing_friendship = Friend.objects.filter(
        (Q(from_user=request.user, to_user=to_user) | 
         Q(from_user=to_user, to_user=request.user))
    ).first()

    if existing_friendship:
        if existing_friendship.status == 1:
            return Response({"detail": "You are already friends."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "A friend request is already pending."}, status=status.HTTP_400_BAD_REQUEST)
    
    friend_request = Friend.objects.create(
        from_user=request.user,
        to_user=to_user,
        status=0  # pending
    )

    serializer = FriendSerializer(friend_request)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    """
    Current user accepts a friend request.
    Requires `friend_request_id` in POST data.
    """
    friend_request_id = request.data.get('friend_request_id')
    if not friend_request_id:
        return Response(
            {"detail": "friend_request_id is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    friend_request = get_object_or_404(
        Friend,
        id=friend_request_id,
        to_user=request.user,
        status=0  # still pending
    )

    # Update status to accepted
    friend_request.status = 1
    friend_request.save()

    serializer = FriendSerializer(friend_request)
    return Response(serializer.data, status=status.HTTP_200_OK)
