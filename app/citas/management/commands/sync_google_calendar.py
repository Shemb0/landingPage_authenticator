from django.core.management.base import BaseCommand
from app.agent.calendar_service import get_calendar_service
from app.citas.models import Citas
from datetime import datetime, timezone


class Command(BaseCommand):
    help = "Importa desde Google Calendar solo los eventos creados por el estudio."

    def handle(self, *args, **kwargs):
        service = get_calendar_service()

        # Traer eventos futuros que tengan el tag "estudio_juridico"
        now = datetime.now(timezone.utc).isoformat()

        result = service.events().list(
            calendarId="primary",
            timeMin=now,
            singleEvents=True,
            orderBy="startTime",
            privateExtendedProperty="source=estudio_juridico",
        ).execute()

        eventos = result.get("items", [])

        if not eventos:
            self.stdout.write(self.style.WARNING("No se encontraron eventos del estudio en Google Calendar."))
            return

        creados   = 0
        existentes = 0

        for evento in eventos:
            google_id = evento.get("id")

            # Si ya existe en la DB, no duplicar
            if Citas.objects.filter(google_event_id=google_id).exists():
                existentes += 1
                continue

            # Parsear fecha
            start_raw = evento["start"].get("dateTime") or evento["start"].get("date")
            try:
                if "T" in start_raw:
                    fecha = datetime.fromisoformat(start_raw)
                else:
                    fecha = datetime.fromisoformat(f"{start_raw}T09:00:00+00:00")
            except ValueError:
                self.stdout.write(self.style.ERROR(f"Fecha inválida en evento {google_id}, se omite."))
                continue

            # El summary tiene formato "Cita: Nombre Apellido"
            summary = evento.get("summary", "Cita")
            partes  = summary.replace("Cita: ", "").split(" ", 1)
            nombre   = partes[0] if len(partes) > 0 else "Desconocido"
            apellido = partes[1] if len(partes) > 1 else ""

            Citas.objects.create(
                name=evento.get("description", "Consulta jurídica"),
                date=fecha,
                client_name=nombre,
                client_surname=apellido,
                phone_number="",
                google_event_id=google_id,
                estado="confirmada",
            )
            creados += 1

        self.stdout.write(self.style.SUCCESS(
            f"Sincronización completa: {creados} importadas, {existentes} ya existían."
        ))
