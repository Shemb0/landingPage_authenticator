from django.contrib import admin
from .models import Citas

@admin.register(Citas)
class CitasAdmin(admin.ModelAdmin):
    list_display = ["id", "client_name", "client_surname", "date", "tipo", "estado"]
    list_filter  = ["estado", "tipo"]
    search_fields = ["client_name", "client_surname", "client_email"]
