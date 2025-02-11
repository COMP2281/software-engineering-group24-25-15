from django.contrib import admin

# Register your models here.

from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile, Statistics


admin.site.register(Profile)
admin.site.register(Statistics)