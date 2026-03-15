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

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=8080)
        with open(token_path, "w") as token:
            token.write(creds.to_json())

    return build("calendar", "v3", credentials=creds)


def get_available_slots(date_str: str) -> list[str]:
    """Returns available 1-hour slots for a given date (YYYY-MM-DD), Mon-Fri 9-18hs."""
    service = get_calendar_service()
    date = datetime.strptime(date_str, "%Y-%m-%d")

    if date.weekday() >= 5:
        return []

    all_slots = [datetime(date.year, date.month, date.day, h) for h in range(9, 18)]

    start = date.replace(hour=0, minute=0, second=0, tzinfo=timezone.utc).isoformat()
    end = date.replace(hour=23, minute=59, second=59, tzinfo=timezone.utc).isoformat()

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
            slot < datetime.fromisoformat(b["end"]).replace(tzinfo=None)
            and slot_end > datetime.fromisoformat(b["start"]).replace(tzinfo=None)
            for b in busy
        )
        if not occupied:
            available.append(slot.strftime("%H:%M"))

    return available


def create_event(date_str: str, hour: str, client_name: str, client_surname: str, reason: str) -> str:
    """Creates a Google Calendar event. Returns the event link."""
    service = get_calendar_service()

    start = TIMEZONE.localize(datetime.strptime(f"{date_str} {hour}", "%Y-%m-%d %H:%M"))
    end = start + timedelta(hours=1)

    event = {
        "summary": f"Cita: {client_name} {client_surname}",
        "description": reason,
        "start": {"dateTime": start.isoformat()},
        "end": {"dateTime": end.isoformat()},
    }

    created = service.events().insert(calendarId="primary", body=event).execute()
    return created.get("htmlLink", "")
