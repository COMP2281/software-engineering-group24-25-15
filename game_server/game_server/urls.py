"""
URL configuration for game_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from accounts.views import ActivateUserView
from accounts.views import CustomPasswordResetView
from accounts.views import CheckUserActivationView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    # Place custom endpoints before the Djoser URLs
    path('auth/users/activate/<uid>/<token>/', ActivateUserView.as_view(), name='user-activate'),
    path('auth/users/custom_reset_password/', CustomPasswordResetView.as_view(), name='custom-reset-password'),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
    path('game/', include('game.urls')),
    path('check_user_activation/', CheckUserActivationView.as_view(), name='check-user-activation'),
    path('friends/', include('friends.urls')),
]

