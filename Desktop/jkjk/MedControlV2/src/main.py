from src.service import MedicationService
from src.weather import get_temperature_alert

import os

service = MedicationService()


def clear():
    os.system("cls" if os.name == "nt" else "clear")


def show_weather_alert():
    print("\n" + get_temperature_alert() + "\n")


while True:
    show_weather_alert()
    print("1 - Adicionar medicamento")
    print("2 - Listar medicamentos")
    print("3 - Marcar como tomado")
    print("0 - Sair")

    op = input("Escolha: ")

    if op == "1":
        name = input("Nome: ")
        time = input("Horário: ")
        service.add(name, time)
        clear()

    elif op == "2":
        meds = service.list()
        clear()
        if not meds:
            print("Nenhum medicamento cadastrado.")
        for i, m in enumerate(meds):
            status = "✅ Tomado" if m.taken else "⏳ Pendente"
            print(f"{i} - {m.name} ({m.time}) - {status}")

    elif op == "3":
        index = int(input("Índice: "))
        service.mark_as_taken(index)
        clear()

    elif op == "0":
        break
