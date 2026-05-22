# MedControl CLI

## Problema

Idosos e pacientes com doenças crônicas frequentemente esquecem de tomar medicamentos nos horários corretos, o que pode causar complicações sérias de saúde.

## Solução

O **MedControl CLI** é uma aplicação de linha de comando que permite registrar medicamentos e horários, listar os pendentes e marcar os já tomados — funcionando como um diário de medicação simples e acessível.

## Público-alvo

- Idosos
- Cuidadores
- Pacientes com rotina de medicação contínua

## Funcionalidades

- Adicionar medicamento com nome e horário
- Listar todos os medicamentos e seus status
- Marcar medicamento como tomado
- Persistência em arquivo JSON local

## Tecnologias

- Python 3.11+
- pytest
- ruff

## Versão atual

`1.0.0`

## Estrutura do projeto

```
medcontrol/
├── src/
│   ├── main.py
│   ├── models.py
│   ├── service.py
│   └── storage.py
├── tests/
│   └── test_service.py
├── .github/workflows/ci.yml
├── requirements.txt
├── VERSION
└── README.md
```

## Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO

# (Opcional) Crie um ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt
```

## Como executar

```bash
python -m src.main
```

## Como rodar os testes

```bash
pytest
```

## Como rodar o lint

```bash
ruff check .
```

## Autor

Arthur — Bootcamp II
