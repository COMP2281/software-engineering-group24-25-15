from django.db import models
from django.conf import settings

class Question(models.Model):
    question_text = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=255)
    incorrect_answer1 = models.CharField(max_length=255)
    incorrect_answer2 = models.CharField(max_length=255)
    incorrect_answer3 = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text

class Statistics(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='statistics')
    score = models.IntegerField(default=0)
    games = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s statistics"

