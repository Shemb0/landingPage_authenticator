import os
import pytz
from datetime import datetime, timedelta, timezone

TIMEZONE = pytz.timezone("Europe/Madrid")
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from django.conf import settings

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def get_calendar_service():
    creds = None
    token_path = os.path.join(settings.BASE_DIR, "token.json")
    creds_path = os.path.join(settings.BASE_DIR, "credential-landingpage.json")

    # En producción leer el token desde variable de entorno
    google_token_json = os.environ.get("GOOGLE_TOKEN_JSON")
    if google_token_json:
        import json
        from google.oauth2.credentials import Credentials as GoogleCreds
        creds = GoogleCreds.from_authorized_user_info(json.loads(google_token_json), SCOPES)
    elif os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=8080)
        if not google_token_json:
            with open(token_path, "w") as token:
                token.write(creds.to_json())

    return build("calendar", "v3", credentials=creds)


def get_available_slots(date_str: str) -> list[str]:
    """Returns available 1-hour slots for a given date (YYYY-MM-DD), Mon-Fri 9-18hs."""
    service = get_calendar_service()
    date = datetime.strptime(date_str, "%Y-%m-%d")

    if date.weekday() >= 5:
        return []

    # Slots en hora Madrid (naive)
    all_slots = [datetime(date.year, date.month, date.day, h) for h in range(9, 18)]

    # Rango de consulta en hora Madrid para cubrir el día completo
    start = TIMEZONE.localize(date.replace(hour=0, minute=0, second=0)).isoformat()
    end   = TIMEZONE.localize(date.replace(hour=23, minute=59, second=59)).isoformat()

    result = service.freebusy().query(body={
        "timeMin": start,
        "timeMax": end,
        "items": [{"id": "primary"}],
    }).execute()

    busy = result["calendars"]["primary"]["busy"]

    available = []
    for slot in all_slots:
        slot_end = slot + timedelta(hours=1)
        occupied = any(
            # Convertir busy a hora Madrid (naive) para comparar en la misma base
            slot < datetime.fromisoformat(b["end"]).astimezone(TIMEZONE).replace(tzinfo=None)
            and slot_end > datetime.fromisoformat(b["start"]).astimezone(TIMEZONE).replace(tzinfo=None)
            for b in busy
        )
        if not occupied:
            available.append(slot.strftime("%H:%M"))

    return available


def create_event(date_str: str, hour: str, client_name: str, client_surname: str, reason: str) -> dict:
    """Creates a Google Calendar event. Returns dict with id and htmlLink."""
    service = get_calendar_service()

    start = TIMEZONE.localize(datetime.strptime(f"{date_str} {hour}", "%Y-%m-%d %H:%M"))
    end = start + timedelta(hours=1)

    event = {
        "summary": f"Cita: {client_name} {client_surname}",
        "description": reason,
        "start": {"dateTime": start.isoformat()},
        "end": {"dateTime": end.isoformat()},
        "extendedProperties": {
            "private": {"source": "estudio_juridico"}
        },
    }

    created = service.events().insert(calendarId="primary", body=event).execute()
    return {"id": created.get("id", ""), "link": created.get("htmlLink", "")}


def delete_event(event_id: str) -> bool:
    """Deletes a Google Calendar event by ID. Returns True if successful."""
    try:
        service = get_calendar_service()
        service.events().delete(calendarId="primary", eventId=event_id).execute()
        return True
    except Exception:
        return False


def update_event(event_id: str, date_str: str, hour: str, client_name: str, client_surname: str, reason: str) -> bool:
    """Updates an existing Google Calendar event."""
    try:
        service = get_calendar_service()
        start = TIMEZONE.localize(datetime.strptime(f"{date_str} {hour}", "%Y-%m-%d %H:%M"))
        end = start + timedelta(hours=1)

        event = {
            "summary": f"Cita: {client_name} {client_surname}",
            "description": reason,
            "start": {"dateTime": start.isoformat()},
            "end": {"dateTime": end.isoformat()},
        }

        service.events().update(calendarId="primary", eventId=event_id, body=event).execute()
        return True
    except Exception:
        return False
