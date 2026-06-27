# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack Event RSVP application. Two roles — **Organizer** (creates/deletes events, sees RSVPs to their events) and **Attendee** (browses events, RSVPs, manages their own reservations). Role is carried as an `isOrganizer` boolean from registration through the JWT into the UI.

The repo contains three top-level apps:
- `frontend/` — React (Create React App) SPA. **Active.**
- `springboot/` — Spring Boot 4 + MySQL REST API. **Active backend.**
- `backend/` — legacy Django backend. **Archived/inactive** — do not modify unless explicitly asked; the Spring Boot app replaced it.

The Spring Boot backend is a direct port of the Django app, which explains several design decisions (see Architecture).

## Commands

### Frontend (`cd frontend`)
- `npm install` — install deps
- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build to `frontend/build/`
- `npm test` — Jest watch mode (CRA)
- `npm test -- --watchAll=false src/App.test.js` — run a single test file once (non-interactive)

### Backend (`cd springboot`)
- `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`) — run API on http://localhost:8080
- `./mvnw clean install` — build / package to `target/`
- `./mvnw test` — run tests (currently only a context-loads smoke test)
- `./mvnw test -Dtest=DemoApplicationTests#contextLoads` — run a single test method

Requires **Java 21** and a **MySQL** instance on `localhost:3306` with database `event_rsvp_db` (Hibernate `ddl-auto=update` creates/updates the schema on boot).

### Running the full stack
No root orchestration (no root `package.json`, Docker, or Makefile). Start MySQL, then the backend, then the frontend — each in its own terminal.

## Architecture

### Request flow
Browser (React, :3000) → `axios` instance in `frontend/src/services/api.js` (baseURL `http://localhost:8080/api`) → Spring `JwtFilter` → Controller → Service → Repository (Spring Data JPA) → MySQL. CORS in the backend is restricted to `http://localhost:3000`.

### Authentication & roles (read these together)
- Login (`POST /api/auth/login`) returns a JWT plus user fields. `JwtUtil` signs an HS256 token whose claims are **`userId` and `isOrganizer`** (1-day expiry).
- `JwtFilter` validates `Authorization: Bearer <token>` and exposes `userId` / `isOrganizer` as **request attributes**. There are **no Spring Security roles/authorities** — controllers read these attributes and enforce authorization manually (e.g. `EventController` rejects creates when `!isOrganizer`; `RsvpController` lets attendees delete only their own RSVPs and organizers delete RSVPs on events they own).
- Passwords use **Django-compatible PBKDF2-HMAC-SHA256** (`pbkdf2_sha256$260000$...`) via `DjangoPasswordHasher` — a migration artifact so existing Django user hashes keep working.
- Frontend auth state lives entirely in `localStorage` (`token`, `username`, `email`, `isOrganizer`, `user_id`). Most React routes are **not** guarded client-side; `OrganizerRoute` wraps only `/create-event`. Real enforcement is server-side. `frontend/src/utils/auth.js` handles logout/clearing.

### Backend layout (`springboot/src/main/java/com/example/demo`)
Standard layered structure: `controller/` → `service/` → `repository/` → `model/` (JPA entities) with `dto/`, `security/`, `config/`, and `exception/` (a `GlobalExceptionHandler` that turns bean-validation failures into JSON).

Entities: `CustomUser` (table `customuser`), `Event`, `Rsvp`. **Relationships are modeled as plain `Long` FK columns** (`Event.organizerId`, `Rsvp.userId`, `Rsvp.eventId`) — there are no JPA `@ManyToOne`/`@OneToMany` associations. Consequently, related data is fetched with explicit repository finder methods (`findByOrganizerId`, `findByEventId`, `countByEventId`) and a custom `@Query` (`RsvpRepository.findRsvpsForOrganizer`). RSVP counts are computed and attached in `EventResponse`/`RsvpResponse` DTOs rather than derived from entity graphs.

### Key REST endpoints (actual, from controllers)
- `POST /api/auth/register`, `POST /api/auth/login` — public
- `GET /api/events`, `GET /api/events/{id}`, `GET /api/events/{id}/rsvps` — public reads
- `POST /api/events`, `DELETE /api/events/{id}` — organizer only
- `POST /api/rsvp`, `GET /api/rsvp`, `GET /api/rsvp/event/{eventId}`, `DELETE /api/rsvp/{id}` — authenticated
- `GET /api/profile/organizer`, `GET /api/profile/attendee` — role-specific

Note: `README.md` lists an idealized/partly-aspirational API (e.g. `PUT /events/{id}`, `/token/refresh`, `/rsvp/user`). Trust the controllers over the README. In particular the frontend's axios response interceptor tries `POST /api/token/refresh` on a 401 — that endpoint does **not** exist in the Spring backend, so token refresh is effectively a no-op carried over from the Django design.

### Frontend structure (`frontend/src`)
- `App.js` — all routes. Components: `Welcome`, `LoginForm`, `RegisterForm`, `Dashboard`, `EventList`, `RSVPForm`, `CreateEventForm`, `OrganizerProfile`, `AttendeeProfile`, plus `OrganizerRoute` guard and `pages/Unauthorized`.
- `services/api.js` — shared axios instance with request interceptor (attaches JWT, strips browser-extension headers, normalizes trailing slashes, disables caching) and response interceptor (401 refresh attempt, extension-interference retry). Note: some components (`LoginForm`, `RegisterForm`, `CreateEventForm`) call `axios` directly against hardcoded `http://localhost:8080/...` instead of this instance.
- `styles/` — plain CSS per area (`authen.css`, `dashboard.css`, `eventStyling.css`, `profile.css`, `createForms.css`), built on a shared design-token palette and the Inter font defined in `src/index.css` / `public/index.html`.

## Gotchas
- The backend URL is **hardcoded** (`http://localhost:8080`) in `services/api.js` and in several components; there is no env-based config. Changing the API host means editing multiple files.
- The JWT signing secret and MySQL credentials are committed in source (`JwtUtil`, `application.properties`). Treat as dev-only.
- CORS only allows `:3000`; serving the frontend from another origin requires updating the backend CORS config.
- The two backends share concepts but only `springboot/` is live; ignore `backend/` (Django) unless asked.
