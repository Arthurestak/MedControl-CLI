class Medication:
    def __init__(self, name: str, time: str, taken: bool = False, db_id: int | None = None):
        self.name = name
        self.time = time
        self.taken = taken
        self.db_id = db_id

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "time": self.time,
            "taken": self.taken,
        }

    @staticmethod
    def from_dict(data: dict) -> "Medication":
        return Medication(
            name=data["name"],
            time=data["time"],
            taken=data["taken"],
        )
