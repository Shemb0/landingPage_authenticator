from django.db import models

class Cliente(models.Model):
    class Meta:
        verbose_name = "cliente"
        verbose_name_plural = "clientes"

    name = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)

    def __str__(self):
        return self.name
    

