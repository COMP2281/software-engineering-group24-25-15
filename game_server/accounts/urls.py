# accounts/urls.py

from django.urls import path
from .views import UserRetrieveView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("retrieve-user/", UserRetrieveView.as_view(), name="retrieve-user"),
]
