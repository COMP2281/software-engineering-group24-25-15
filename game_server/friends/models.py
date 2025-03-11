from django.db import models
from django.conf import settings

class Friend(models.Model):
    """
    Represents a friend request or friendship between two users.
    status=0 => pending
    status=1 => accepted (friends)
    """
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_requests'
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_requests'
    )
    status = models.IntegerField(default=0)  # 0 => pending, 1 => friends

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} (status={self.status})"
