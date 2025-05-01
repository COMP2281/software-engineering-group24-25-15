from django.urls import path
from .views import get_questions, get_responce, UserStatisticsView, UserStatisticsDetailView, AllUserStatisticsView

urlpatterns = [
    path('questions/', get_questions, name='get_questions'),
    path('responce/', get_responce, name='get_responce'),
    path("my-statistics/", UserStatisticsView.as_view(), name="my-statistics"),
    path("statistics/<int:user_id>/", UserStatisticsDetailView.as_view(), name="user-statistics"),
    path('user-statistics/all/', AllUserStatisticsView.as_view(), name='all-user-statistics'),
]

