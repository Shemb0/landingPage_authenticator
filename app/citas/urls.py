from django.urls import path
from .views import CitasListCreate, CitasDetail, GoogleCalendarWebhook, SlotsDisponibles, ContactoView

urlpatterns = [
    path("", CitasListCreate.as_view(), name="citas-list"),
    path("slots/", SlotsDisponibles.as_view(), name="slots-disponibles"),
    path("contacto/", ContactoView.as_view(), name="contacto"),
    path("<int:pk>/", CitasDetail.as_view(), name="citas-detail"),
    path("webhook/google/", GoogleCalendarWebhook.as_view(), name="google-webhook"),
]
