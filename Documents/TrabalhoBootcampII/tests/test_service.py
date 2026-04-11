import pytest
from unittest.mock import patch
from src.service import MedicationService
from src.models import Medication


@pytest.fixture
def svc():
    """Service isolado: não carrega nem salva em disco."""
    with patch("src.service.load", return_value=[]), \
         patch("src.service.save"):
        service = MedicationService()
        yield service


# ── Medication (model) ────────────────────────────────────────────────────────

class TestMedication:
    def test_init_defaults(self):
        med = Medication("Paracetamol", "08:00")
        assert med.name == "Paracetamol"
        assert med.time == "08:00"
        assert med.taken is False

    def test_to_dict(self):
        med = Medication("Aspirina", "18:00")
        assert med.to_dict() == {"name": "Aspirina", "time": "18:00", "taken": False}

    def test_from_dict(self):
        data = {"name": "Dipirona", "time": "21:00", "taken": True}
        med = Medication.from_dict(data)
        assert med.name == "Dipirona"
        assert med.taken is True

    def test_roundtrip(self):
        original = Medication("Omeprazol", "07:00", taken=True)
        restored = Medication.from_dict(original.to_dict())
        assert restored.name == original.name
        assert restored.taken == original.taken


# ── MedicationService ─────────────────────────────────────────────────────────

class TestMedicationService:

    # add
    def test_add_valid(self, svc):
        with patch("src.service.save"):
            svc.add("Dipirona", "08:00")
        assert len(svc.list()) == 1
        assert svc.list()[0].name == "Dipirona"

    def test_add_empty_name_raises(self, svc):
        with pytest.raises(ValueError, match="Nome inválido"):
            svc.add("", "08:00")

    def test_add_multiple(self, svc):
        with patch("src.service.save"):
            svc.add("Med A", "08:00")
            svc.add("Med B", "20:00")
        assert len(svc.list()) == 2

    # list
    def test_list_empty_initially(self, svc):
        assert svc.list() == []

    # mark_as_taken
    def test_mark_as_taken_valid(self, svc):
        svc.medications = [Medication("Dipirona", "12:00")]
        with patch("src.service.save"):
            svc.mark_as_taken(0)
        assert svc.list()[0].taken is True

    def test_mark_as_taken_negative_index_raises(self, svc):
        svc.medications = [Medication("Dipirona", "12:00")]
        with pytest.raises(ValueError, match="Índice inválido"):
            svc.mark_as_taken(-1)

    def test_mark_as_taken_out_of_range_raises(self, svc):
        svc.medications = [Medication("Dipirona", "12:00")]
        with pytest.raises(ValueError, match="Índice inválido"):
            svc.mark_as_taken(5)

    def test_mark_as_taken_empty_list_raises(self, svc):
        with pytest.raises(ValueError, match="Índice inválido"):
            svc.mark_as_taken(0)
