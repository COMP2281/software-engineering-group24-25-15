from django.urls import path
from .views import get_questions, get_responce

urlpatterns = [
    path('questions/', get_questions, name='get_questions'),
    path('responce/', get_responce, name='get_responce'),
]
