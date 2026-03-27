"""
Eventify AI Service - Flask Microservice
Provides: Recommendations, Chatbot, Demand Prediction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Static event catalogue for recommendations
EVENT_CATALOGUE = [
    {"id": 1, "name": "RCB vs CSK - IPL 2025",       "category": "Sports",  "location": "Bengaluru", "price": 1500},
    {"id": 2, "name": "Arijit Singh Live Concert",    "category": "Music",   "location": "Mumbai",    "price": 2500},
    {"id": 3, "name": "Pushpa 2 - The Rule",          "category": "Movies",  "location": "Hyderabad", "price": 350},
    {"id": 4, "name": "Mumbai Indians vs KKR",         "category": "Sports",  "location": "Mumbai",    "price": 1200},
    {"id": 5, "name": "Diljit - Dil-Luminati Tour",   "category": "Music",   "location": "Delhi",     "price": 3500},
    {"id": 6, "name": "Kalki 2898 AD",                "category": "Movies",  "location": "Chennai",   "price": 400},
    {"id": 7, "name": "Sunburn Festival 2025",        "category": "Music",   "location": "Goa",       "price": 5000},
    {"id": 8, "name": "India vs Australia Test",      "category": "Sports",  "location": "Hyderabad", "price": 800},
    {"id": 9, "name": "Comedy Night - Zakir Khan",    "category": "Comedy",  "location": "Pune",      "price": 999},
    {"id":10, "name": "Stree 2 - Fear Is Back",       "category": "Movies",  "location": "Delhi",     "price": 380},
]

CITY_ALIASES = {
    "hyd": "Hyderabad", "hyderabad": "Hyderabad",
    "mumbai": "Mumbai", "bombay": "Mumbai",
    "delhi": "Delhi", "new delhi": "Delhi",
    "bengaluru": "Bengaluru", "bangalore": "Bengaluru",
    "chennai": "Chennai", "madras": "Chennai",
    "pune": "Pune", "goa": "Goa",
}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "running", "service": "Eventify AI"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(force=True) or {}
    category = data.get("category", "").strip()
    location = data.get("location", "").strip()

    results = EVENT_CATALOGUE[:]

    if category:
        results = [e for e in results if e["category"].lower() == category.lower()]
    if location:
        results = [e for e in results if e["location"].lower() == location.lower()]

    # If nothing matches, return random 3 suggestions
    if not results:
        results = random.sample(EVENT_CATALOGUE, min(3, len(EVENT_CATALOGUE)))
        return jsonify({"recommendations": results, "note": "Showing popular events"})

    return jsonify({"recommendations": results[:5]})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True) or {}
    message = data.get("message", "").lower().strip()

    # City queries
    for alias, city in CITY_ALIASES.items():
        if alias in message:
            events = [e for e in EVENT_CATALOGUE if e["location"] == city]
            if events:
                names = ", ".join(e["name"] for e in events[:3])
                return jsonify({"reply": f"Events in {city}: {names}. Book your tickets now!"})
            return jsonify({"reply": f"No upcoming events in {city} right now. Check back soon!"})

    # Category queries
    if "sport" in message or "cricket" in message or "ipl" in message:
        events = [e for e in EVENT_CATALOGUE if e["category"] == "Sports"]
        names = ", ".join(e["name"] for e in events[:3])
        return jsonify({"reply": f"Sports events available: {names}"})

    if "music" in message or "concert" in message:
        events = [e for e in EVENT_CATALOGUE if e["category"] == "Music"]
        names = ", ".join(e["name"] for e in events[:3])
        return jsonify({"reply": f"Music events: {names}"})

    if "movie" in message or "film" in message:
        events = [e for e in EVENT_CATALOGUE if e["category"] == "Movies"]
        names = ", ".join(e["name"] for e in events[:3])
        return jsonify({"reply": f"Now showing: {names}"})

    if "comedy" in message:
        events = [e for e in EVENT_CATALOGUE if e["category"] == "Comedy"]
        names = ", ".join(e["name"] for e in events)
        return jsonify({"reply": f"Comedy shows: {names}"})

    # Price queries
    if "cheap" in message or "budget" in message or "affordable" in message:
        cheap = sorted(EVENT_CATALOGUE, key=lambda x: x["price"])[:3]
        names = ", ".join(f"{e['name']} (Rs.{e['price']})" for e in cheap)
        return jsonify({"reply": f"Budget-friendly events: {names}"})

    # Greeting
    if any(w in message for w in ["hello", "hi", "hey", "hii"]):
        return jsonify({"reply": "Hi! I am Eventify AI. Ask me about events by city, category, or price. How can I help?"})

    # Help
    if "help" in message or "what can" in message:
        return jsonify({"reply": "I can help you find events! Try: 'Show events in Hyderabad', 'Music concerts', 'Cheap events', or 'Sports events'."})

    return jsonify({"reply": "I didn't quite get that. Try asking: 'events in Mumbai', 'sports events', 'music concerts', or 'cheap events'."})

@app.route("/predict-demand", methods=["POST"])
def predict_demand():
    data = request.get_json(force=True) or {}
    event_id = data.get("eventId", 0)
    category = data.get("category", "")

    demand_map = {"Sports": 95, "Music": 87, "Movies": 75, "Comedy": 65}
    score = demand_map.get(category, 70) + random.randint(-5, 5)

    return jsonify({
        "eventId": event_id,
        "demandScore": min(score, 99),
        "prediction": "HIGH" if score >= 80 else "MEDIUM" if score >= 50 else "LOW",
        "message": "Selling fast! Book now." if score >= 80 else "Good availability."
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
