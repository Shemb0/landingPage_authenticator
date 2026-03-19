
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('agent/', include('app.agent.urls')),
    path('citas/', include('app.citas.urls')),
    path("cliente/",include("app.cliente.urls")),
    path('auth/', include('djoser.urls')),       # registro, activación, reset password
    path('auth/', include('djoser.urls.jwt')),   # login, refresh, verify token
]
