from django.urls import path
from .views import ClientListView,ClientView

urlpatterns = [
    path("clientes/", ClientListView.as_view()),
    path("clientes/<int:pk>/", ClientView.as_view()),
]