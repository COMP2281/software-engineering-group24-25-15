from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Statistics

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)
    # Extra fields not in the User model:
    sex = serializers.CharField(write_only=True, required=True)
    age = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = User
        # List extra fields along with username, email, and password
        fields = ['username', 'email', 'password', 'sex', 'age']

    def create(self, validated_data):
        # Extract additional data
        sex = validated_data.pop('sex')
        age = validated_data.pop('age')
        
        # Create the User (using create_user so that the password is hashed)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create the Profile object with additional info
        Profile.objects.create(user=user, sex=sex, age=age)
        
        # Create the Statistics object (initialized to zero)
        Statistics.objects.create(user=user)
        
        return user
