import pytz
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Citas
from .serializers import CitasSerializer
from .email_service import enviar_confirmacion_cita, enviar_notificacion_contacto
from app.agent.calendar_service import create_event, delete_event, update_event, get_available_slots

MADRID = pytz.timezone("Europe/Madrid")


class SlotsDisponibles(APIView):
    """
    GET /citas/slots/?date=YYYY-MM-DD → horarios disponibles para ese día
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"error": "Parámetro 'date' requerido (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            slots = get_available_slots(date_str)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Excluir slots ya reservados en la DB (pendiente o confirmada)
        citas_del_dia = Citas.objects.filter(
            date__date=date_str,
            estado__in=["pendiente", "confirmada"],
        )
        horas_tomadas = {c.date.astimezone(MADRID).strftime("%H:%M") for c in citas_del_dia}
        slots = [s for s in slots if s not in horas_tomadas]

        return Response({"slots": slots})


class CitasListCreate(APIView):
    """
    GET  /citas/        → lista todas las citas (requiere auth)
    POST /citas/        → crea cita en DB + Google Calendar (público)
    """

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        citas = Citas.objects.all().order_by("date")
        serializer = CitasSerializer(citas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CitasSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Verificar que el slot no esté ya tomado en la DB
        fecha_cita = data["date"]
        conflicto = Citas.objects.filter(
            date=fecha_cita,
            estado__in=["pendiente", "confirmada"],
        ).exists()
        if conflicto:
            return Response({"error": "Este horario ya está reservado."}, status=status.HTTP_409_CONFLICT)

        # Crear evento en Google Calendar (convertir a hora Madrid)
        fecha_madrid = data["date"].astimezone(MADRID)
        fecha  = fecha_madrid.strftime("%Y-%m-%d")
        hora   = fecha_madrid.strftime("%H:%M")
        result = create_event(
            date_str=fecha,
            hour=hora,
            client_name=data["client_name"],
            client_surname=data["client_surname"],
            reason=data.get("name", "Consulta jurídica"),
        )

        cita = serializer.save(google_event_id=result.get("id", ""))
        enviar_confirmacion_cita(cita)
        return Response(CitasSerializer(cita).data, status=status.HTTP_201_CREATED)


class CitasDetail(APIView):
    """
    GET    /citas/{id}/   → detalle de una cita
    PATCH  /citas/{id}/   → actualiza cita en DB + Google Calendar
    DELETE /citas/{id}/   → elimina cita en DB + Google Calendar
    """

    permission_classes = [IsAuthenticated]

    def _get_cita(self, pk):
        try:
            return Citas.objects.get(pk=pk)
        except Citas.DoesNotExist:
            return None

    def patch(self, request, pk):
        cita = self._get_cita(pk)
        if not cita:
            return Response({"detail": "No encontrada."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CitasSerializer(cita, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Si cambia la fecha o el cliente, actualizar en Google Calendar
        if cita.google_event_id:
            data         = serializer.validated_data
            dt_madrid    = data.get("date", cita.date).astimezone(MADRID)
            fecha        = dt_madrid.strftime("%Y-%m-%d")
            hora         = dt_madrid.strftime("%H:%M")
            update_event(
                event_id=cita.google_event_id,
                date_str=fecha,
                hour=hora,
                client_name=data.get("client_name", cita.client_name),
                client_surname=data.get("client_surname", cita.client_surname),
                reason=data.get("name", cita.name),
            )

        serializer.save()
        return Response(CitasSerializer(cita).data)

    def delete(self, request, pk):
        cita = self._get_cita(pk)
        if not cita:
            return Response({"detail": "No encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Eliminar de Google Calendar
        if cita.google_event_id:
            delete_event(cita.google_event_id)

        cita.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactoView(APIView):
    """
    POST /citas/contacto/ → envía el formulario de contacto al admin por email
    """
    permission_classes = [AllowAny]

    def post(self, request):
        nombre   = request.data.get("nombre", "").strip()
        email    = request.data.get("email", "").strip()
        telefono = request.data.get("telefono", "").strip()
        asunto   = request.data.get("asunto", "").strip()
        mensaje  = request.data.get("mensaje", "").strip()

        if not nombre or not email or not asunto or not mensaje:
            return Response({"error": "Campos requeridos: nombre, email, asunto, mensaje."}, status=status.HTTP_400_BAD_REQUEST)

        enviar_notificacion_contacto(nombre, email, telefono, asunto, mensaje)
        return Response({"ok": True}, status=status.HTTP_200_OK)


class GoogleCalendarWebhook(APIView):
    """
    POST /citas/webhook/google/
    Google Calendar llama a este endpoint cuando hay cambios en el calendario.
    Sincroniza los cambios (cancelaciones) de vuelta a la DB.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        # Google envía headers de notificación
        resource_state = request.headers.get("X-Goog-Resource-State")

        # "sync" es el primer ping de Google al registrar el webhook — ignorarlo
        if resource_state == "sync":
            return Response(status=status.HTTP_200_OK)

        # Cuando un evento cambia, Google avisa con "exists" o "not_exists"
        if resource_state in ("exists", "not_exists"):
            # Acá podrías buscar el evento en Google Calendar y comparar con la DB
            # Por ahora marcamos la cita como cancelada si el estado es "not_exists"
            resource_id = request.headers.get("X-Goog-Resource-Id", "")

            if resource_state == "not_exists" and resource_id:
                Citas.objects.filter(google_event_id=resource_id).update(estado="cancelada")

        return Response(status=status.HTTP_200_OK)
