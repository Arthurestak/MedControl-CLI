import json
import os
from src.models import Medication

FILE = "data.json"


def load():
    if not os.path.exists(FILE):
        return []

    with open(FILE, "r") as f:
        content = f.read().strip()
        if not content:
            return []
        data = json.loads(content)
        return [Medication.from_dict(x) for x in data]


def save(medications):
    with open(FILE, "w") as f:
        json.dump([m.to_dict() for m in medications], f, indent=4)
