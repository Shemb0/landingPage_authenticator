from django.db import models
from datetime import timedelta


class Citas(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    client_name = models.CharField(max_length=100)
    client_surname = models.CharField(max_length=100)
    phone_number= models.IntegerField(max_length=15)

    def __str__(self):
        return self.name