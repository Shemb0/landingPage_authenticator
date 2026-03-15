from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields= ['id', 'name', 'file_size', 'uploaded_at', 'is_indexed']