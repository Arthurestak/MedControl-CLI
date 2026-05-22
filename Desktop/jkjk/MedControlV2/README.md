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
   export SUPABASE_URL=https://kdyhqbeqwngkbppmvioy.supabase.co
   export SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeWhxYmVxd25na2JwcG12aW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODY4ODksImV4cCI6MjA5NDk2Mjg4OX0.a45r3JLACpKiURyRtqtPAiJggruoM2_EZopno7nvVjM

4. Execute:
   python -m src.main

## 🧪 Testes
   pytest --tb=short
