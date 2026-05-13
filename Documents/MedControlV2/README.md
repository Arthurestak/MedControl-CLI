# MedControl CLI

![CI](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/ci.yml/badge.svg)

> 🌐 **Deploy (como executar sem instalar):** veja a seção [Como executar](#como-executar) abaixo.  
> 📦 **Repositório:** https://github.com/SEU_USUARIO/SEU_REPOSITORIO

---

## Problema

Idosos e pacientes com doenças crônicas frequentemente esquecem de tomar medicamentos nos horários corretos, o que pode causar complicações sérias de saúde. Além disso, temperaturas extremas podem danificar medicamentos armazenados incorretamente.

## Solução

O **MedControl CLI** é uma aplicação de linha de comando que permite registrar medicamentos e horários, listar os pendentes e marcar os já tomados — funcionando como um diário de medicação simples e acessível.

A partir da **Etapa 2**, a aplicação consulta a **API Open-Meteo** (gratuita e aberta) para exibir a temperatura atual de Brasília e emitir alertas automáticos sobre condições climáticas que possam afetar a conservação dos medicamentos.

## Funcionalidades

- Adicionar medicamento com nome e horário
- Listar todos os medicamentos e seus status
- Marcar medicamento como tomado
- Persistência em arquivo JSON local
- ⛅ **[NOVO]** Alerta climático em tempo real (temperatura e risco para medicamentos)

## Tecnologias

- Python 3.11+ (sem dependências externas para a API — usa `urllib` padrão)
- pytest / pytest-cov
- ruff (lint)
- GitHub Actions (CI/CD)

## API Pública utilizada

| API | URL | Por que? |
|-----|-----|----------|
| **Open-Meteo** | https://open-meteo.com/ | Gratuita, sem chave, retorna temperatura atual por coordenadas geográficas |

## Versão atual

`2.0.0`

## Estrutura do projeto

```
medcontrol/
├── src/
│   ├── main.py         # Ponto de entrada CLI
│   ├── models.py       # Modelo Medication
│   ├── service.py      # Regras de negócio
│   ├── storage.py      # Persistência JSON
│   └── weather.py      # [NOVO] Integração com API Open-Meteo
├── tests/
│   ├── test_service.py              # Testes unitários (Etapa 1)
│   └── test_weather_integration.py  # [NOVO] Testes de integração (Etapa 2)
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
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

# Instale as dependências
pip install -r requirements.txt
```

## Como executar

```bash
python -m src.main
```

Ao iniciar, a aplicação exibirá automaticamente a temperatura atual e um alerta de conservação de medicamentos, por exemplo:

```
🌡️  Brasília: 33 °C — 🔆 Calor elevado. Verifique se seus medicamentos precisam de refrigeração.

1 - Adicionar medicamento
2 - Listar medicamentos
3 - Marcar como tomado
0 - Sair
```

## Como rodar os testes

```bash
# Testes unitários
pytest tests/test_service.py

# Testes de integração (requer internet)
pytest tests/test_weather_integration.py -v

# Todos os testes
pytest --tb=short
```

## Como rodar o lint

```bash
ruff check .
```

## Autor

Arthur — Bootcamp II
