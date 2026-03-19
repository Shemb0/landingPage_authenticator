from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "lastname", "email"]
    search_fields = ["name", "lastname", "email"]
