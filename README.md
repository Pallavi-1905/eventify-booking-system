# 🎟️ Eventify — AI-Powered Event Booking System
> BookMyShow-style full-stack project | React + Spring Boot + MySQL + Flask AI

---

## 📁 Project Structure

```
eventify/
├── frontend/          ← React + Tailwind CSS
├── backend/           ← Spring Boot (MVC)
├── ai-service/        ← Flask AI Microservice
└── database/          ← MySQL Schema + Sample Data
```

---

## ▶️ Run Instructions (in order)

### Step 1 — MySQL Database
```bash
# Open MySQL and run:
mysql -u root -p < database/schema.sql
```

### Step 2 — Backend (Spring Boot)
```bash
cd backend

# IMPORTANT: Update src/main/resources/application.properties
# Set your MySQL password:
#   spring.datasource.password=YOUR_PASSWORD

mvn clean install
mvn spring-boot:run
# Runs at: http://localhost:8080
```

### Step 3 — AI Service (Flask)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
# Runs at: http://localhost:5000
```

### Step 4 — Frontend (React)
```bash
cd frontend
npm install
npm start
# Opens at: http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | URL                        | Description              |
|--------|----------------------------|--------------------------|
| GET    | /events                    | Get all events           |
| GET    | /events/{id}               | Get event by ID          |
| GET    | /events/category/{cat}     | Filter by category       |
| GET    | /events/location/{loc}     | Filter by location       |
| POST   | /events                    | Create event (Admin)     |
| PUT    | /events/{id}               | Update event (Admin)     |
| DELETE | /events/{id}               | Delete event (Admin)     |
| GET    | /bookings                  | Get all bookings         |
| POST   | /bookings                  | Create booking           |
| POST   | /events/recommend          | AI recommendations       |
| POST   | /events/chat               | AI chatbot               |

---

## ✅ Features
- 🎭 Browse Movies, Sports, Music, Comedy events
- 🔍 Search & filter by category and city
- 🪑 Interactive seat selection grid
- 🎟️ Booking confirmation page
- 🤖 AI recommendation engine (Flask)
- 💬 AI chatbot (floating widget)
- 📊 Admin dashboard with analytics
- ➕ Admin: Add / Edit / Delete events
- 📋 Admin: View all bookings
- 📱 Fully responsive dark UI
