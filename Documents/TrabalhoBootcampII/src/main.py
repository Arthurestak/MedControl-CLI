from src.service import MedicationService

import os
service = MedicationService()

while True:
    print("\n1 - Adicionar")
    print("2 - Listar")
    print("3 - Marcar como tomado")
    print("0 - Sair")

    op = input("Escolha: ")

    if op == "1":
        name = input("Nome: ")
        time = input("Horário: ")
        service.add(name, time)
        os.system("cls")

    elif op == "2":
        meds = service.list()
        for i, m in enumerate(meds):
            status = "Tomado" if m.taken else "Pendente"
            os.system("cls")
            print(f"{i} - {m.name} ({m.time}) - {status}")
        

    elif op == "3":
        index = int(input("Índice: "))
        service.mark_as_taken(index)
        os.system("cls")

    elif op == "0":
        break