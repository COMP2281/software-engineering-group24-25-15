from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=255)
    incorrect_answer1 = models.CharField(max_length=255)
    incorrect_answer2 = models.CharField(max_length=255)
    incorrect_answer3 = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text


