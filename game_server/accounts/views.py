# accounts/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer

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
