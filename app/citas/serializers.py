from rest_framework import serializers
from .models import Citas


class CitasSerializers(serializers.ModelSerializer):
    class Meta:
        model = Citas
        fields = {"name", "date", "client_name", "client_surname", "phone_number"}