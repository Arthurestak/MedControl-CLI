class Medication:
    def __init__(self, name, time, taken=False):
        self.name = name
        self.time = time
        self.taken = taken

    def to_dict(self):
        return {
            "name": self.name,
            "time": self.time,
            "taken": self.taken
        }

    @staticmethod
    def from_dict(data):
        return Medication(data["name"], data["time"], data["taken"])