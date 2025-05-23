# accounts/views.py
from rest_framework import generics, status, views
from rest_framework.response import Response
from djoser.serializers import ActivationSerializer
from rest_framework.request import Request
from rest_framework.views import APIView
from django.contrib.auth.models import User
from djoser.views import UserViewSet
from djoser.utils import decode_uid
import secrets
import string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from game.models import Statistics
from .serializers import UserObtainEmailSerializer

User = get_user_model()


class ActivateUserView(views.APIView):
    """Handles user activation via GET request when clicking the email link"""
    token_generator = UserViewSet.token_generator  

    def get(self, request, uid, token):
        data = {"uid": uid, "token": token}
        serializer = ActivationSerializer(data=data, context={"view": self})
        
        if serializer.is_valid():
            user = serializer.validated_data.get("user")
            if user is None:
                # Decode the UID manually if not provided by the serializer
                user_pk = decode_uid(uid)
                try:
                    user = User.objects.get(pk=user_pk)
                except User.DoesNotExist:
                    return HttpResponse(
                        "Invalid UID.",
                        status=status.HTTP_400_BAD_REQUEST,
                        content_type="text/html"
                    )
           
            user.is_active = True
            user.save()

            Statistics.objects.create(user=user)

            return HttpResponse(
                "<h1>Congratulations, your account is activated!</h1>",
                status=status.HTTP_200_OK,
                content_type="text/html"
            )
        
       
        return HttpResponse(
            "Activation failed: " + str(serializer.errors),
            status=status.HTTP_400_BAD_REQUEST,
            content_type="text/html"
        )





class CustomPasswordResetView(APIView):
    # Override authentication and permissions to allow unauthenticated access.
    permission_classes = [AllowAny]
    authentication_classes = []  

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # Generate a new secure password 
        alphabet = string.ascii_letters + string.digits + string.punctuation
        new_password = ''.join(secrets.choice(alphabet) for _ in range(12))
        
        
        user.set_password(new_password)
        user.save()
        
        subject = "Your New Password"
        message = (
            f"Hello {user.username},\n\n"
            f"Your password has been reset. Your new password is:\n\n"
            f"{new_password}\n\n"
            f"Please log in and change this password immediately."
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        
        send_mail(subject, message, from_email, recipient_list)
        
        return Response({"detail": "New password has been sent to your email."}, status=status.HTTP_200_OK)
    


from django.contrib.auth.hashers import check_password

class CheckUserActivationView(APIView):
    """Check if a user with provided username, email, and password is activated."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"detail": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username, email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if not check_password(password, user.password):
            return Response({"detail": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"active": user.is_active}, status=status.HTTP_200_OK)


class UserRetrieveView(APIView):
    """
    API to retrieve user's email and ID by providing username, authenticated via token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")

        if not username:
            return Response({"detail": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.username != username:
            return Response({"detail": "Provided username does not match authenticated user."}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            "id": request.user.id,
            "email": request.user.email
        }, status=status.HTTP_200_OK)