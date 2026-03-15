from django.contrib import admin
from .models import Document

class DocumentAdmin(admin.ModelAdmin):
    list_display = ("name",)

admin.site.register(Document,DocumentAdmin)

# Register your models here.
