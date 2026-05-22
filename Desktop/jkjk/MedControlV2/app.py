from flask import Flask, jsonify
from src.storage import load

app = Flask(__name__)

@app.route("/")
def index():
    return "<h1>MedControl API</h1><p><a href='/medications'>Ver medicamentos</a></p>"

@app.route("/medications")
def medications():
    meds = load()
    return jsonify([{"name": m.name, "time": m.time, "taken": m.taken} for m in meds])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
