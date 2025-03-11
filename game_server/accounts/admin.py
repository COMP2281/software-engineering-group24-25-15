from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()

# Unregister the default UserAdmin
admin.site.unregister(User)

# Register User with a custom admin class
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("id", "username", "email", "is_active", "is_staff")  # Show ID in admin panel
    list_display_links = ("id", "username")  # Make ID and username clickable
