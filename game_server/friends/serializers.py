from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Friend

User = get_user_model()

# custom serializer to use in Friends app
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class FriendSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Friend
        fields = ["id", "from_user", "to_user", "status"]
