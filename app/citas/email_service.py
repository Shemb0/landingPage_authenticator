from django.core.mail import send_mail
from django.conf import settings

MESES = ["enero","febrero","marzo","abril","mayo","junio",
         "julio","agosto","septiembre","octubre","noviembre","diciembre"]

TIPOS = {
    "civil":       "Derecho Civil",
    "comercial":   "Derecho Comercial",
    "familia":     "Derecho de Familia",
    "inmobiliario":"Derecho Inmobiliario",
    "laboral":     "Derecho Laboral",
    "penal":       "Derecho Penal",
}

import pytz
MADRID = pytz.timezone("Europe/Madrid")


def enviar_confirmacion_cita(cita):
    """Envía email de confirmación al cliente cuando agenda una cita."""
    if not cita.client_email:
        return

    fecha_madrid = cita.date.astimezone(MADRID)
    fecha_str = f"{fecha_madrid.day} de {MESES[fecha_madrid.month - 1]} de {fecha_madrid.year}"
    hora_str  = fecha_madrid.strftime("%H:%M")
    tipo_str  = TIPOS.get(cita.tipo, cita.tipo)

    asunto = "Solicitud de cita recibida — Estudio Jurídico"
    mensaje = f"""Estimado/a {cita.client_name} {cita.client_surname},

Hemos recibido su solicitud de cita con los siguientes datos:

  Fecha:    {fecha_str}
  Hora:     {hora_str} hs
  Área:     {tipo_str}
  Motivo:   {cita.name or "—"}

Su cita está pendiente de confirmación. Nos comunicaremos a la brevedad para confirmarla.

Ante cualquier consulta no dude en contactarnos.

Saludos,
Estudio Jurídico
"""
    send_mail(
        subject=asunto,
        message=mensaje,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[cita.client_email],
        fail_silently=True,
    )


def enviar_notificacion_contacto(nombre, email, telefono, asunto, mensaje):
    """Envía al admin el formulario de contacto recibido desde la landing page."""
    if not settings.ADMIN_EMAIL:
        return

    cuerpo = f"""Nueva consulta desde el sitio web:

  Nombre:    {nombre}
  Email:     {email}
  Teléfono:  {telefono or "—"}
  Asunto:    {asunto}

Mensaje:
{mensaje}
"""
    send_mail(
        subject=f"Nueva consulta web: {asunto}",
        message=cuerpo,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=True,
    )
