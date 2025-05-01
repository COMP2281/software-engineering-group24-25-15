from rest_framework import serializers
from .models import Question, Statistics
from django.contrib.auth import get_user_model


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistics
        fields = ["score", "games", "wins"]


User = get_user_model()

class UserStatisticsListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Statistics
        fields = ['username', 'score', 'games', 'wins']