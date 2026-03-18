from django.db import models


class Citas(models.Model):

    ESTADO_CHOICES = [
        ("pendiente",   "Pendiente"),
        ("confirmada",  "Confirmada"),
        ("cancelada",   "Cancelada"),
    ]

    TIPO_CHOICES = [
        ("civil",       "Derecho Civil"),
        ("comercial",   "Derecho Comercial"),
        ("familia",     "Derecho de Familia"),
        ("inmobiliario","Derecho Inmobiliario"),
        ("laboral",     "Derecho Laboral"),
        ("penal",       "Derecho Penal"),
    ]

    name           = models.CharField(max_length=255)
    date           = models.DateTimeField()
    client_name    = models.CharField(max_length=100)
    client_surname = models.CharField(max_length=100)
    phone_number   = models.CharField(max_length=20)
    client_email   = models.EmailField(blank=True, null=True)
    tipo           = models.CharField(max_length=20, choices=TIPO_CHOICES, default="civil")
    estado         = models.CharField(max_length=15, choices=ESTADO_CHOICES, default="pendiente")
    google_event_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.client_name} {self.client_surname} — {self.date}"