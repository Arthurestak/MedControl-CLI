from src.storage import load, save_new, update_taken
from src.models import Medication
 
 
class MedicationService:
    def __init__(self):
        self.medications = load()
 
    def add(self, name: str, time: str) -> None:
        if not name:
            raise ValueError("Nome inválido")
 
        med = Medication(name, time)
        db_id = save_new(med)
        med.db_id = db_id
        self.medications.append(med)
 
    def list(self) -> list[Medication]:
        return self.medications
 
    def mark_as_taken(self, index: int) -> None:
        if index < 0 or index >= len(self.medications):
            raise ValueError("Índice inválido")
 
        med = self.medications[index]
        med.taken = True
        update_taken(med.db_id, True)
