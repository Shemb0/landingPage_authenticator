from rest_framework import serializers
from .models import Citas


class CitasSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Citas
        fields = [
            "id", "name", "date", "client_name", "client_surname",
            "phone_number", "client_email", "tipo", "estado", "google_event_id",
        ]
        read_only_fields = ["id", "google_event_id"]