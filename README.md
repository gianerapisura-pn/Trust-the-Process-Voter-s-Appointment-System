# Trust the Process: Voter Appointment System

A voter registration appointment system built with Node.js, Express, MySQL/MariaDB, Sequelize, and vanilla HTML, CSS, and JavaScript.

## Requirements

- Node.js and npm
- MySQL or MariaDB (XAMPP is supported)
- A free local port for the Express server

## Project Structure

```text
backend/
|-- controllers/     Request handlers
|-- database/        Initial database setup script
|-- frontend/        HTML, CSS, JavaScript, and images
|-- middleware/      JWT authentication middleware
|-- models/          Sequelize models and relationships
|-- routes/          API routes
|-- .env.example     Environment configuration template
|-- package.json     Dependencies and npm scripts
`-- server.js        Application entry point
```

## Setup

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start MySQL or MariaDB.

3. Import `database/Sprint1_DatabaseCode.sql` once to create the `StudentVoterAppointments` database and its initial tables. Skip this step if the database is already configured.

4. Copy `.env.example` to a new file named `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Update `.env` with the database credentials and secrets for your computer:

   ```env
   DB_NAME=StudentVoterAppointments
   DB_USER=root
   DB_PASS=
   DB_HOST=localhost
   DB_PORT=3306
   PORT=3000
   JWT_SECRET=replace-with-a-long-random-secret
   ADMIN_USER=admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASS=replace-with-a-strong-admin-password
   ```

6. Start the application:

   ```bash
   npm start
   ```

   For development with automatic restarts:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000` in a browser. Always open the frontend through the Express server; do not open the HTML files directly.

## Using a Different Port

If port `3000` is unavailable, set any free port in `.env`:

```env
PORT=8080
```

Then open `http://localhost:8080`. The frontend uses the relative `/api` path, so no frontend code changes are required when the port changes.

## Main Features

- Multi-step voter appointment booking
- Date selection based on the current day with a 90-day booking window
- Appointment code generation and downloadable appointment details
- Appointment lookup and cancellation using the appointment code and email address
- Admin login, dashboard statistics, appointment filtering, and status updates
- JWT protection for administrative routes

## Main API Endpoints

Public endpoints:

- `GET /health`
- `GET /api/sites`
- `GET /api/slots`
- `POST /api/voters`
- `GET /api/appointments?appointment_code=...&email_address=...`
- `DELETE /api/appointments/:id?appointment_code=...&email_address=...`
- `POST /api/auth/login`

Protected endpoints require a valid Bearer token:

- `GET /api/admin/stats`
- `GET /api/appointments`
- `GET /api/appointments/:id`
- `PUT /api/appointments/:id/status`
- `GET /api/voters`

## Database

The application uses one database named `StudentVoterAppointments`. The file `database/Sprint1_DatabaseCode.sql` is the initial setup script, not a second database. Sequelize checks and synchronizes the tables when the server starts, but the database itself must already exist.

Main tables:

- `voter_applicant`
- `appointment_site`
- `appointment_slot`
- `appointment`
- `admin_user`

## Testing

Run the integration smoke test while MySQL or MariaDB is available:

```bash
npm test
```

Check production dependencies for known security advisories:

```bash
npm run audit
```

GitHub Actions runs both checks automatically for pull requests and updates to `main` using a temporary MariaDB service.

## Troubleshooting

- **Unknown database:** Import `database/Sprint1_DatabaseCode.sql` or verify `DB_NAME`.
- **Access denied:** Check `DB_USER` and `DB_PASS` in `.env`.
- **Port already in use:** Change `PORT` in `.env` and open the matching browser URL.
- **Failed to fetch:** Make sure the Express server is running and access the site through its `http://localhost:<PORT>` address.
- **Admin login fails:** Check the `ADMIN_USER` and `ADMIN_PASS` used when the admin account was first created.

Do not commit `.env` because it contains machine-specific credentials and secrets.
