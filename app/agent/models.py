from django.db import models


class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.BinaryField()
    file_size = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_indexed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.name