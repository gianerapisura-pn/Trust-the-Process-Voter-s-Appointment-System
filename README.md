# Backend Project README (Updated Based on Your Image)

This README provides a complete, clear, and beginner-friendly explanation of your backend project structure, purpose of each folder/file, how the server works, how routes connect to controllers, and how the frontend interacts with the backend.

---

# Overview
This backend is built using **Node.js**, **Express**, and **SQLite**. It handles:
- User authentication (Admin & Applicant)
- Voter management
- Appointment creation, validation, and management
- Database operations via models
- API endpoints consumed by your frontend HTML + JS pages

---

# Project Structure
Below is the full explanation of each folder and file based on the structure shown.

```
BACKEND/
│── controllers/
│   ├── appointmentsControllers.js
│   ├── authControllers.js
│   └── votersControllers.js
│
│── data/
│   └── database.sqlite
│
│── frontend/
│   ├── admin.js
│   ├── api.js
│   ├── appointment_code.html
│   ├── appointment.html
│   ├── appointment.js
│   ├── gender_and_address.html
│   ├── index.html
│   ├── manage_appointment_det.html
│   ├── manage_appointment.html
│   ├── manage.js
│   ├── mylogo.png
│   ├── requirements.html
│   ├── select_time.html
│   ├── site_and_date.html
│   ├── style.css
│   └── voters.js
│
│── middleware/
│   └── auth.js
│
│── models/
│   ├── appointment.js
│   ├── index.js
│   ├── user.js
│   └── voter.js
│
│── routes/
│   ├── appointments.js
│   ├── auth.js
│   └── voters.js
│
│── server.js
│── package.json
│── package-lock.json
│── .gitignore
```

---

# FOLDER-BY-FOLDER EXPLANATION

## 1. **controllers/**
Controllers contain the **main business logic** of the backend. Each controller handles a specific domain.

### ✔ appointmentsControllers.js
Handles all **appointment-related logic**, including:
- Creating new appointments
- Validating appointment slots
- Generating appointment codes
- Updating or managing appointments

### ✔ authControllers.js
Handles **authentication** logic:
- Admin login
- Token generation
- Credential validation

### ✔ votersControllers.js
Handles **voter-related operations**, such as:
- Checking if a voter exists
- Fetching voter data
- Creating or updating voter details

---

## 2. **data/**

### ✔ database.sqlite
This is your **SQLite database file**. All tables (users, voters, appointments, etc.) are stored here.

---

## 3. **frontend/**
This folder contains all **HTML, JS, and CSS files** of your frontend interface.

### Important Files:
- **index.html** → Landing page
- **appointment.html** → User inputs name, details
- **site_and_date.html** → Select location & date
- **select_time.html** → Choose appointment slot
- **appointment_code.html** → Displays final appointment code
- **requirements.html** → Shows requirements
- **manage_appointment.html** → Admin appointment listing
- **manage.js** → Admin frontend logic
- **admin.js** → Admin login frontend
- **api.js** → Centralized fetch wrapper that calls backend API

This folder acts like a mini-website that communicates with backend via `fetch()`.

---

## 4. **middleware/**

### ✔ auth.js
Middleware that **verifies JWT tokens**.  
Used for:
- Protecting admin-only routes
- Ensuring only logged-in users access protected endpoints

---

## 5. **models/**
Models define the **database structure and queries**.

### ✔ appointment.js
Defines the Appointment table structure and database operations.

### ✔ user.js
Defines the User(Admin) table.

### ✔ voter.js
Defines the Voter/Applicant table.

### ✔ index.js
Centralizes database initialization and model export.

---

## 6. **routes/**
Routes connect the **HTTP endpoints** to their corresponding controllers.

### ✔ auth.js
Contains login route:  
`POST /auth/login`

### ✔ appointments.js
Contains appointment endpoints:
- `POST /appointments`
- `GET /appointments/:id`
- `PUT /appointments/:id`
- Admin appointment listing

### ✔ voters.js
Contains voter endpoints:
- `POST /voters`
- `GET /voters/:id`

Each route imports the correct controller.

---

## 7. **server.js**
This is the **entry point** of your backend server.

### It handles:
- Initializing Express
- Applying middleware
- Connecting to routes
- Connecting to database
- Starting the API server (e.g., port 3000)

Once you run:
```
npm start
```
This file boots the entire backend.

---

# How the Backend Works (Flow Explanation)

### 1. **Frontend calls the API**
Example from `api.js`:
```js
apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) });
```

### 2. **Route receives the request**
Example: `/routes/auth.js`
```js
router.post('/login', authControllers.login);
```

### 3. **Controller handles the logic**
Example inside `authControllers.js`:
- Validate user
- Check database
- Generate token

### 4. **Model interacts with the database**
Example inside `user.js`:
- Query SQLite
- Return results

### 5. **Response is sent back to the frontend**
Frontend receives JSON → updates UI.

---

# How to Run the Project

### 1. Install dependencies
```
npm install
```

### 2. Start the server
```
npm run dev
```

### 3. Access frontend pages
Open the `.html` files inside `frontend/` via Live Server or your browser.

### 4. Test backend using Postman
Use endpoints like:
- `POST http://localhost:3000/auth/login`
- `POST http://localhost:3000/voters`
- `POST http://localhost:3000/appointments`

Everything remains fully Postman-compatible.

---

# Authentication Overview
- Admin logs in using `/auth/login`
- Backend returns a **JWT token**
- Token is required for admin functions
- Token is verified using `middleware/auth.js`

---

# Appointment Flow Summary
1. User enters personal info → `/voters`
2. User selects site/date → `/appointments/check-slot`
3. User selects time → `/appointments`
4. Appointment Code is generated → saved in DB
5. Admin manages appointments via `/appointments/admin`

---

# Additional Notes
- Database auto-updates using SQLite
- Frontend-backend communication is REST-based
- Modular structure for maintainability

