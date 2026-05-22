"""
weather.py — Integração com a API pública Open-Meteo.

Busca a temperatura atual de Brasília (padrão) e retorna
um alerta de cuidado caso o calor ou frio extremo possa
afetar a conservação de medicamentos.

API utilizada: https://open-meteo.com/ (gratuita, sem chave)
"""

import urllib.request
import json

# Brasília – DF (padrão)
DEFAULT_LAT = -15.7801
DEFAULT_LON = -47.9292
DEFAULT_CITY = "Brasília"

BASE_URL = (
    "https://api.open-meteo.com/v1/forecast"
    "?latitude={lat}&longitude={lon}"
    "&current_weather=true"
    "&temperature_unit=celsius"
    "&timezone=America%2FSao_Paulo"
)


def fetch_weather(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON) -> dict:
    """
    Faz a requisição HTTP GET para Open-Meteo e retorna o dict
    com os dados de ``current_weather``.

    Levanta ``RuntimeError`` se a resposta não contiver os campos
    esperados.
    """
    url = BASE_URL.format(lat=lat, lon=lon)
    with urllib.request.urlopen(url, timeout=5) as resp:
        data = json.loads(resp.read().decode())

    if "current_weather" not in data:
        raise RuntimeError("Resposta inesperada da API Open-Meteo")

    return data["current_weather"]


def get_temperature_alert(lat: float = DEFAULT_LAT,
                          lon: float = DEFAULT_LON,
                          city: str = DEFAULT_CITY) -> str:
    """
    Retorna uma string com a temperatura atual e, quando aplicável,
    um aviso sobre conservação de medicamentos.

    Exemplos de retorno:
        "🌡️  Brasília: 28 °C — Condições normais."
        "🌡️  Brasília: 38 °C — ⚠️  CALOR EXTREMO! Guarde seus
         medicamentos em local fresco e arejado."
    """
    try:
        cw = fetch_weather(lat, lon)
        temp = cw["temperature"]
    except Exception as exc:
        return f"⚠️  Não foi possível obter dados climáticos: {exc}"

    msg = f"🌡️  {city}: {temp} °C"

    if temp >= 35:
        msg += (
            " — ⚠️  CALOR EXTREMO! Guarde seus medicamentos em "
            "local fresco e arejado, longe da luz solar."
        )
    elif temp >= 30:
        msg += (
            " — 🔆 Calor elevado. Verifique se seus medicamentos "
            "precisam de refrigeração."
        )
    elif temp <= 5:
        msg += (
            " — 🥶 FRIO INTENSO! Alguns medicamentos líquidos podem "
            "ser danificados pelo congelamento."
        )
    else:
        msg += " — ✅ Condições climáticas normais para medicamentos."

    return msg
