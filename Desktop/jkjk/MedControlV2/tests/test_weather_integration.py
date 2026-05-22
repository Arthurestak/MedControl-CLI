"""
test_weather_integration.py — Teste de Integração com a API Open-Meteo.

Estratégia:
  - Testes marcados com @pytest.mark.integration fazem a requisição REAL
    para validar que a API responde corretamente.
  - Testes com mock garantem a lógica de alerta sem depender de rede,
    sendo executados sempre (inclusive em CI sem saída para internet).
"""

import pytest
from unittest.mock import patch, MagicMock
from src.weather import fetch_weather, get_temperature_alert


# ── Testes de integração real (requerem internet) ─────────────────────────────

@pytest.mark.integration
def test_fetch_returns_expected_fields():
    """A API Open-Meteo deve retornar temperatura e código de tempo."""
    result = fetch_weather()   # coordenadas padrão: Brasília

    assert isinstance(result, dict), "Resposta deve ser um dicionário"
    assert "temperature" in result, "Campo 'temperature' ausente na resposta"
    assert "weathercode" in result, "Campo 'weathercode' ausente na resposta"
    assert isinstance(result["temperature"], (int, float)), \
        "Temperatura deve ser numérica"


@pytest.mark.integration
def test_fetch_temperature_is_plausible():
    """Temperatura retornada deve estar em intervalo realista (-50 a 60 °C)."""
    result = fetch_weather()
    temp = result["temperature"]
    assert -50 <= temp <= 60, \
        f"Temperatura {temp} °C fora do intervalo esperado (-50 a 60)"


# ── Testes com mock (sempre executados) ───────────────────────────────────────

class TestGetTemperatureAlert:
    """Verifica a lógica de alertas sem depender de rede."""

    def _mock_weather(self, temperature: float):
        return {"temperature": temperature, "weathercode": 0, "windspeed": 10}

    def test_normal_conditions(self):
        with patch("src.weather.fetch_weather",
                   return_value=self._mock_weather(22)):
            msg = get_temperature_alert()
        assert "✅" in msg
        assert "22" in msg

    def test_high_heat_warning(self):
        with patch("src.weather.fetch_weather",
                   return_value=self._mock_weather(31)):
            msg = get_temperature_alert()
        assert "refrigeração" in msg

    def test_extreme_heat_warning(self):
        with patch("src.weather.fetch_weather",
                   return_value=self._mock_weather(38)):
            msg = get_temperature_alert()
        assert "CALOR EXTREMO" in msg

    def test_extreme_cold_warning(self):
        with patch("src.weather.fetch_weather",
                   return_value=self._mock_weather(3)):
            msg = get_temperature_alert()
        assert "congelamento" in msg

    def test_api_failure_returns_friendly_message(self):
        with patch("src.weather.fetch_weather",
                   side_effect=Exception("timeout")):
            msg = get_temperature_alert()
        assert "Não foi possível obter dados climáticos" in msg

    def test_missing_current_weather_raises(self):
        """fetch_weather deve levantar RuntimeError se a chave faltar."""
        mock_resp = MagicMock()
        mock_resp.read.return_value = b'{"latitude": -15.78}'
        mock_resp.__enter__ = lambda s: s
        mock_resp.__exit__ = MagicMock(return_value=False)

        with patch("urllib.request.urlopen", return_value=mock_resp):
            with pytest.raises(RuntimeError, match="Resposta inesperada"):
                fetch_weather()

    def test_alert_contains_city_name(self):
        with patch("src.weather.fetch_weather",
                   return_value=self._mock_weather(25)):
            msg = get_temperature_alert(city="Brasília")
        assert "Brasília" in msg
