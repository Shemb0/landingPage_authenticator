from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Services

user = get_user_model()

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(user, UserAdmin)

class ServicesAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)
admin.site.register(Services, ServicesAdmin)


