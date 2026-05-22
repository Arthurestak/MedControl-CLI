# Issue #1 — Integração com API Climática para Alertas de Conservação de Medicamentos

**Labels:** `enhancement`, `entrega-intermediaria`  
**Branch:** `entrega-intermediaria`  
**Milestone:** Etapa 2 — Bootcamp

---

## 📋 Descrição

O MedControl CLI atualmente gerencia medicamentos de forma local, mas não considera fatores ambientais que podem afetar a conservação dos remédios. Temperaturas extremas podem deteriorar medicamentos guardados de forma inadequada.

## 🎯 Funcionalidade a implementar

Integrar a aplicação com a **API pública Open-Meteo** (`https://open-meteo.com/`) para:

1. Buscar a temperatura atual da cidade do usuário (padrão: Brasília - DF)
2. Exibir o alerta climático a cada abertura do menu principal
3. Emitir avisos específicos conforme a faixa de temperatura:
   - ≥ 35 °C → alerta de calor extremo
   - ≥ 30 °C → aviso de calor elevado
   - ≤ 5 °C  → alerta de frio intenso
   - demais  → condições normais

## ✅ Critérios de aceite

- [ ] Novo módulo `src/weather.py` com funções `fetch_weather()` e `get_temperature_alert()`
- [ ] `src/main.py` exibe o alerta climático antes do menu
- [ ] Pelo menos 6 testes de integração em `tests/test_weather_integration.py`
- [ ] Pipeline de CI continua verde (lint + testes)
- [ ] README atualizado com descrição da API e instruções

## 🔗 Referências

- API Open-Meteo: https://open-meteo.com/en/docs
- Documentação de conservação de medicamentos: ANVISA

---

*Closes #1*
