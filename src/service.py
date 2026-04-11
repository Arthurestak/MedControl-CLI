from src.storage import load, save
from src.models import Medication


class MedicationService:
    def __init__(self):
        self.medications = load()

    def add(self, name, time):
        if not name:
            raise ValueError("Nome inválido")

        med = Medication(name, time)
        self.medications.append(med)

        save(self.medications)

    def list(self):
        return self.medications

    def mark_as_taken(self, index):
        if index < 0 or index >= len(self.medications):
            raise ValueError("Índice inválido")

        self.medications[index].taken = True
        save(self.medications)
