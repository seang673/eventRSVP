# Event RSVP Application
## Features
### 👤 Authentication & Authorization
- Secure login & registration using JWT access + refresh tokens
- Role‑based access:
- Automatic token refresh via Axios interceptors
### 📅 Event Management
- Organizers can:
  - Create events
  - Delete events
  - View RSVP counts
  - View all RSVPs for their events (with attendee info)
### 📨 RSVP System
- Attendees can RSVP to any event
- Prevents duplicate RSVPs
- Capacity enforcement (no RSVPs allowed when full)
- Organizer dashboard shows:
  - RSVP list
  - Event name, date, location
  - RSVP count per event
### 🖥️ Frontend (React)
- Clean UI for browsing events
- RSVP form with validation
- Organizer dashboard with event + RSVP data
- Axios instance with:
  - Request interceptor (JWT injection)
  - Response interceptor (token refresh)
### 🛠️ Backend (Spring Boot)
- REST API with layered architecture
- Entities: User, Event, RSVP
- DTO‑driven responses
- Custom JOIN queries for organizer RSVP views
- Secure endpoints with Spring Security
---
## 🧱 Tech Stack
### Frontend
- React
- Axios
- React Router
- CSS modules / custom styling
### Backend
- Spring Boot 3+
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- MySQL database
DevOps
- Environment‑based configuration
- Local + production builds
---
## ▶️ Running the Project

### Backend
```
cd springboot
mvn spring-boot:run
```

### Frontend
```
cd frontend
npm install
npm run start
```


## 📡 API Overview
### Auth
| Method | Endpoint | Description |          
|------|------|------|
| POST  | /auth/register  | Create new user  |
| POST | /auth/login | Login and receive tokens | 
| POST | /token/refresh | Refresh access token | 


### Events
| Method | Endpoint | Description |
|------|------|------|
| GET  | /events | List all events | 
| POST | /events | Create event (organizer only) | 
| PUT | /events/{id} | Update event | 
| DELETE | /events/{id} | Delete event | 


### RSVP
| Method | Endpoint | Description | 
|------|------|------|
| POST | /rsvp | Submit RSVP | 
| GET | /rsvp/user | RSVPs for attendee | 
| GET | /rsvp/organizer | RSVPs for organizer's events | 

---

##  🧪 Testing
Use Postman or Thunder Client to test:
- Login → get access + refresh tokens
- Access and test endpoints with access token
- Validate token refresh flow
---
## 📦 Deployment
The project will soon be deployed using:
- GitHub Actions CI/CD
- Cloud deployment (Render, Railway, AWS, etc.)
---
## 🤝 Contributing
- Pull requests are welcome.
- For major changes, open an issue to discuss what you’d like to modify.
---


