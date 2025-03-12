from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate

class UserObtainEmailSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")

        return {
            "id": user.id,
            "email": user.email,
        }