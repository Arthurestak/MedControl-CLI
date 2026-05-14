# MedControl CLI

![CI](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/ci.yml/badge.svg)

## 🌐 Deploy (acesso público)

> ▶️ **Acesse e execute online:** https://replit.com/@SEU_USUARIO/SEU_REPOSITORIO  
> *(substitua pelo link gerado após importar no Replit — veja instruções abaixo)*

---

## Problema

Idosos e pacientes com doenças crônicas frequentemente esquecem de tomar medicamentos nos horários corretos, o que pode causar complicações sérias de saúde. Além disso, temperaturas extremas podem deteriorar medicamentos armazenados incorretamente.

## Solução

O **MedControl CLI** é uma aplicação de linha de comando que permite registrar medicamentos e horários, listar os pendentes e marcar os já tomados — funcionando como um diário de medicação simples e acessível.

A partir da **Etapa 2**, a aplicação consulta a **API Open-Meteo** (gratuita e aberta) para exibir a temperatura atual de Brasília e emitir alertas automáticos sobre condições climáticas que possam afetar a conservação dos medicamentos.

## Funcionalidades

- Adicionar medicamento com nome e horário
- Listar todos os medicamentos e seus status
- Marcar medicamento como tomado
- Persistência em arquivo JSON local
- ⛅ **[NOVO — Etapa 2]** Alerta climático em tempo real via API Open-Meteo

## API Pública utilizada

| API | URL | Por que? |
|-----|-----|----------|
| **Open-Meteo** | https://open-meteo.com/ | Gratuita, sem chave de API, retorna temperatura atual por coordenadas geográficas |

## Tecnologias

- Python 3.11+ (integração com API via `urllib` padrão — sem dependências externas extras)
- pytest / pytest-cov
- ruff (lint)
- GitHub Actions (CI/CD)
- Replit (deploy/hospedagem)

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
├── .replit                          # [NOVO] Configuração do Replit
├── replit.nix                       # [NOVO] Ambiente Nix para o Replit
├── pytest.ini
├── requirements.txt
├── VERSION
└── README.md
```

## Instalação local

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

## Como executar localmente

```bash
python -m src.main
```

Ao iniciar, a aplicação exibe automaticamente a temperatura atual e um alerta:

```
🌡️  Brasília: 33 °C — 🔆 Calor elevado. Verifique se seus medicamentos precisam de refrigeração.

1 - Adicionar medicamento
2 - Listar medicamentos
3 - Marcar como tomado
0 - Sair
Escolha:
```

## Deploy no Replit (passo a passo)

1. Acesse [replit.com](https://replit.com) e faça login (ou crie uma conta gratuita)
2. Clique em **+ Create Repl** → aba **Import from GitHub**
3. Cole a URL do seu repositório GitHub e clique em **Import**
4. O Replit detecta automaticamente o `.replit` e configura o ambiente
5. Clique em **▶ Run** — a CLI abrirá no terminal do Replit
6. Copie a URL do Repl (formato `https://replit.com/@SEU_USUARIO/SEU_REPOSITORIO`) e cole no topo deste README

## Como rodar os testes

```bash
# Todos os testes (sem chamadas reais à API)
pytest tests/ -m "not integration" --tb=short

# Testes de integração com API real (requer internet)
pytest tests/test_weather_integration.py -m "integration" -v

# Suite completa
pytest --tb=short
```

## Como rodar o lint

```bash
ruff check .
```

## Autor

Arthur — Bootcamp II
