from rest_framework import serializers
from .models import Cliente


class ClienteSerializers(serializers.ModelSerializer):
    class Meta():
        model = Cliente
        fields = ["name","lastname","email"]
