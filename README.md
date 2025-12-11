<<<<<<< HEAD
# Trust the Process: Voter Appointment System

Node.js/Express backend with a simple HTML/CSS/JS frontend for scheduling and managing voter registration appointments. Data is stored in MySQL via Sequelize. Admins can log in and approve/reject appointments.

## Tech Stack
- Backend: Node.js, Express, Sequelize, JWT (admin auth)
- DB: MySQL/MariaDB
- Frontend: Static HTML/CSS/JS served by Express

## Project Structure
```
backend/
├─ controllers/        # request handlers (voters, appointments, admin)
├─ routes/             # express routers (voters.js, appointments.js, admin.js, auth.js, sites.js, slots.js)
├─ models/             # Sequelize models (voter_applicant, appointment, appointment_site, appointment_slot, admin_user)
├─ middleware/         # auth middleware (JWT)
├─ frontend/           # HTML, CSS, JS assets (public-facing + admin UI)
├─ database/           # SQL scripts (e.g., Sprint1_DatabaseCode.sql)
├─ server.js           # app entrypoint and bootstrap
└─ .env.example        # sample env vars
```

## Environment
Copy `.env.example` to `.env` and fill in:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=StudentVoterAppointments
DB_USER=youruser
DB_PASS=yourpass
JWT_SECRET=yourjwtsecret
ADMIN_USER=admin
ADMIN_PASS=admin123
PORT=3000
```

## Setup & Run
1) Install deps: `npm install`
2) Start MySQL and ensure `StudentVoterAppointments` exists (import `database/Sprint1_DatabaseCode.sql` if needed).
3) Start dev server: `npm run dev` (nodemon) or `node server.js`
4) Open frontend pages via `http://localhost:3000/` (HTML files are served statically).

Health check: `GET http://localhost:3000/health`

## Core Flows
### Voter booking
1. Personal info → contact info → site/date/time selection → confirmation.
2. Backend creates `voter_applicant`, `appointment_slot` (if needed), and `appointment` with `appointment_code`.
3. Confirmation page shows the code and allows downloading details (txt).
### Manage appointment (voter)
- Lookup by code + email; view or cancel (if route enabled).
### Admin
1. Login: `POST /api/auth/login` → receives JWT.
2. Stats: `GET /api/admin/stats` (token required).
3. List appointments: `GET /api/appointments` (token required).
4. Update status: `PUT /api/appointments/:id/status` with `{ status: Approved|Rejected|Pending|Confirmed|Cancelled }` (token required).

## Key Endpoints (high level)
- Public:
  - `POST /api/voters` (create applicant + appointment, with site/slot info)
  - `GET /api/appointments?code=...&email=...` (fetch appointment)
- Admin (JWT):
  - `POST /api/auth/login`
  - `GET /api/admin/stats`
  - `GET /api/appointments`
  - `PUT /api/appointments/:id/status`
- Reference data:
  - `GET /api/sites`
  - `GET /api/slots` (if exposed)

## Models (summary)
- `voter_applicant`: personal/contact info
- `appointment_site`: site_name, address, is_active
- `appointment_slot`: site_id, slot_date, start_time, end_time, max_capacity, bookings_count
- `appointment`: applicant_id, slot_id, appointment_code, booking_datetime, status
- `admin_user`: admin_id (PK), username, password_hash, role

## Frontend Pages (selected)
- `index.html`: landing
- `appointment.html`, `gender_and_address.html`, `site_and_date.html`, `select_time.html`, `appointment_code.html`: booking flow
- `manage_appointment.html`: voter lookup/cancel
- `index-admin.html`, `admin.html`: admin login and dashboard

## Running in Postman (smoke test)
1) `GET /health`
2) `POST /api/auth/login` (admin creds) → copy token
3) `POST /api/voters` with full payload (unique email) → get `appointment_code`
4) `GET /api/appointments?code=...&email=...`
5) `PUT /api/appointments/:id/status` with Bearer token

## Notes
- Keep port 3000 free (`netstat`/`taskkill` if needed).
- Use new emails to avoid unique conflicts.
- If DB errors appear, re-check `.env` and that MySQL is running. 

