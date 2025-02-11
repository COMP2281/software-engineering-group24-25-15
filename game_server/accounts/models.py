from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    sex = models.CharField(max_length=10)  # e.g., "Male", "Female", "Other"
    age = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username}'s profile"
    


class Statistics(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='statistics')
    score = models.IntegerField(default=0)
    games = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s statistics"