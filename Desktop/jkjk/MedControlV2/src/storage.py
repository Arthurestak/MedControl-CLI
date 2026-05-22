import os
from supabase import create_client, Client
from src.models import Medication

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

_client: Client | None = None

def get_client() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise EnvironmentError("Variáveis SUPABASE_URL e SUPABASE_KEY não configuradas.")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client

def load() -> list[Medication]:
    client = get_client()
    response = client.table("medications").select("*").execute()
    return [
        Medication(name=row["name"], time=row["time"], taken=row["taken"], db_id=row["id"])
        for row in response.data
    ]

def save_new(medication: Medication) -> int:
    client = get_client()
    response = client.table("medications").insert({
        "name": medication.name,
        "time": medication.time,
        "taken": medication.taken,
    }).execute()
    return response.data[0]["id"]

def update_taken(db_id: int, taken: bool) -> None:
    client = get_client()
    client.table("medications").update({"taken": taken}).eq("id", db_id).execute()
