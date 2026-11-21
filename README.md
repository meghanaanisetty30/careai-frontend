# CareAI Frontend

CareAI is a healthcare management application frontend developed using React. It provides separate interfaces for patients and doctors, allowing users to access healthcare-related services through a user-friendly interface.

## Tech Stack

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router DOM
- Lucide React
- REST API Integration

## Prerequisites

Before running the project, install:

- Node.js
- npm
- Visual Studio Code (recommended)
- CareAI Spring Boot Backend

## Installation

1. Clone or download the frontend project.
2. Open the project folder in Visual Studio Code.
3. Open the terminal.
4. Install the required dependencies.

```bash
npm install
```

## Run the Application

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open this URL in your browser.

## Backend Integration

The frontend communicates with the Spring Boot backend using Axios.

Backend base URL:

```text
http://localhost:8080/api
```

The API configuration is maintained in:

```text
src/services/api.js
```

Axios instance:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
```

## Authentication

The application uses JWT-based authentication.

- Users can register and log in.
- The backend generates a JWT token after successful login.
- The frontend stores the token in browser local storage.
- Axios automatically attaches the token to protected API requests.

Authorization header format:

```http
Authorization: Bearer <JWT_TOKEN>
```

## User Roles

CareAI supports two types of users:

### Patient

Patients can access:

- Patient dashboard
- Upcoming appointments
- Medical reports
- Medical history
- AI health assistant

### Doctor

Doctors can access:

- Doctor dashboard
- Patient management
- Appointment management
- Medical reports
- Consultation-related features

## API Endpoints

The frontend integrates with the following dashboard APIs.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patient/dashboard` | Fetch patient dashboard details |
| GET | `/api/patient/dashboard/upcoming-appointments` | Fetch upcoming appointments |
| GET | `/api/patient/dashboard/recent-reports` | Fetch recent medical reports |
| GET | `/api/doctor/dashboard` | Fetch doctor dashboard details |

All protected API requests require a valid JWT token and the appropriate user role.

## Project Structure

```text
careai-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── package-lock.json
├── index.html
└── vite.config.js
```

## Common Issues

### 1. npm Installation Error

Run:

```bash
npm install
```

If PowerShell blocks npm scripts, try running the command in Command Prompt.

### 2. Backend Connection Error

- Make sure the Spring Boot backend is running.
- Verify the backend URL in `src/services/api.js`.
- Check the browser console for API errors.

### 3. 401 Unauthorized

- Check whether the JWT token is stored in local storage.
- Verify that the token is valid.
- Check whether the Authorization header is sent correctly.

### 4. 403 Forbidden

- Verify the logged-in user's role.
- Check whether the frontend is calling the correct role-specific API.
- Verify the user's role in the backend database.
- Check Spring Security configuration.

### 5. CORS Error

- Make sure the backend allows `http://localhost:5173`.
- Verify the CORS configuration in the backend.
- Restart the backend after configuration changes.

## Build for Production

To create a production build:

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Future Enhancements

- Improved responsive user interface.
- Additional patient dashboard features.
- Enhanced doctor and patient interactions.
- Improved appointment management.
- Additional healthcare services.

---

**CareAI – Healthcare Management Application**
