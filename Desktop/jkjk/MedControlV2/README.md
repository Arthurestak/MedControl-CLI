# MedControl CLI

Aplicação de terminal para gerenciamento de medicamentos, com persistência em banco de dados na nuvem.

## 👥 Integrantes
- Arthur Lopes Oliveira

## 🚀 Tecnologias
- Python 3.11
- Supabase (PostgreSQL em nuvem)
- Flask (interface web)
- pytest (testes automatizados)
- GitHub Actions (CI/CD)

## 🔗 Links
- **Repositório:** https://github.com/Arthurestak/MedControl-CLI
- **Deploy:** https://medcontrol-cli.onrender.com

## ▶️ Como rodar localmente

1. Clone o repositório:
   git clone https://github.com/Arthurestak/MedControl-CLI.git
   cd MedControl-CLI/Desktop/jkjk/MedControlV2

2. Instale as dependências:
   pip install -r requirements.txt

3. Configure as variáveis de ambiente:
   export SUPABASE_URL=sua_url
   export SUPABASE_KEY=sua_chave

4. Execute:
   python -m src.main

## 🧪 Testes
   pytest --tb=short
