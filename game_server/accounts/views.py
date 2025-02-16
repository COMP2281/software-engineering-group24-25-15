# accounts/views.py
from rest_framework import generics, status, views
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer
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

from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": {
                "username": user.username,
                "email": user.email,
                # Optionally include profile data:
                "sex": user.profile.sex,
                "age": user.profile.age,
            }
        }, status=status.HTTP_201_CREATED)





class ActivateUserView(views.APIView):
    """Handles user activation via GET request when clicking the email link"""

    token_generator = UserViewSet.token_generator  # Use Djoser’s token generator

    def get(self, request, uid, token):
        data = {"uid": uid, "token": token}
        serializer = ActivationSerializer(data=data, context={"view": self})
        
        if serializer.is_valid():
            # Try to get the user from the serializer's validated data
            user = serializer.validated_data.get("user")
            if user is None:
                # If not provided, decode uid manually
                user_pk = decode_uid(uid)
                try:
                    user = User.objects.get(pk=user_pk)
                except User.DoesNotExist:
                    return Response({"detail": "Invalid UID."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Activate the user
            user.is_active = True
            user.save()
            return Response({"message": "Account successfully activated"}, status=status.HTTP_204_NO_CONTENT)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class CustomPasswordResetView(APIView):
    # Override authentication and permissions to allow unauthenticated access.
    permission_classes = [AllowAny]
    authentication_classes = []  # This disables any global authentication for this view

    def post(self, request, *args, **kwargs):
        print("custom password reset view")
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # To avoid exposing whether a user exists, return 204 No Content.
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # Generate a new secure password (for example, 12 characters long)
        alphabet = string.ascii_letters + string.digits + string.punctuation
        new_password = ''.join(secrets.choice(alphabet) for _ in range(12))
        
        # Update the user's password (using set_password to hash the password properly)
        user.set_password(new_password)
        user.save()
        
        # Prepare and send the email with the new password
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