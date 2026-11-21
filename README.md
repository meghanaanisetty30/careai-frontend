CareAI -- Frontend
CareAI is a healthcare web application frontend built with React and
Vite. It provides separate patient and doctor experiences and
communicates with a Spring Boot backend through REST APIs.
Tech Stack
- React
- Vite
- JavaScript
- Axios -- HTTP requests to the backend
- React Router -- client-side navigation
- Lucide React -- icons
- CSS -- page styling
Prerequisites
Install the following before running the project:
- Node.js (LTS version recommended)
- npm
- The CareAI Spring Boot backend running locally
Check your installations:
node -v
npm -v
Getting Started
1. Open the frontend project
Open a terminal in the frontend project directory (the directory
containing package.json).
2. Install dependencies
npm install
3. Configure the backend URL
The Axios instance is configured in:
src/services/api.js
The current configuration uses:
baseURL: "http://localhost:8080/api"
Make sure the Spring Boot backend is running at http://localhost:8080.
If your backend uses a different host or port, update the baseURL
accordingly.

The API service also reads the JWT token from browser localStorage and
attaches it to requests using the Authorization: Bearer <token>
header.
4. Start the development server
npm run dev
Vite will display the local development URL in the terminal. Open that
URL in your browser (commonly http://localhost:5173).
Available Scripts
  Command             Description
  npm install       Installs project dependencies
npm run dev       Starts the Vite development server
npm run build     Creates a production build
npm run preview   Previews the production build locally
Application Areas
The frontend includes separate patient and doctor dashboard experiences.
Patient
- Patient dashboard and overview cards
- Appointment booking and appointment navigation
- Upcoming appointments summary
- Medical history navigation
- Medical reports navigation
- AI health assistant navigation
Doctor
- Doctor dashboard and overview cards
- Appointment management navigation
- Patient information navigation
- Medical reports navigation
The dashboard retrieves data from the backend using the configured Axios
API service. Protected API requests require a valid JWT token and the
appropriate user role.
API Integration
The frontend uses the shared Axios instance:
src/services/api.js
The patient dashboard currently requests these backend endpoints:
  Method                  Endpoint                                         Purpose
  GET                     /api/patient/dashboard                         Patient dashboard
summary

  GET                     /api/patient/dashboard/upcoming-appointments   Upcoming patient
appointments
GET                     /api/patient/dashboard/recent-reports          Recent medical reports
The doctor dashboard requests:

  Method   Endpoint                  Purpose
  GET      /api/doctor/dashboard   Doctor dashboard summary

Other pages may call additional endpoints for their respective features.
Check the relevant page and backend controller for the complete API
contract.
Suggested Project Structure
The exact structure may vary as the project develops. The main frontend
areas include:
frontend/
├── public/
├── src/
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── components/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
Authentication Notes
- Sign in through the application's login page.
- The frontend expects the authentication flow to store the JWT under
  the token key in localStorage.
- The API service attaches the stored token to outgoing requests.
- Backend authorization determines whether the logged-in user can
  access patient or doctor endpoints.
- If a protected request returns 401 Unauthorized or
  403 Forbidden, check that the user is logged in, the token is
  valid, and the account has the correct role.
Troubleshooting
npm is blocked in Windows PowerShell
If PowerShell reports that npm.ps1 cannot be loaded because script
execution is disabled, use Command Prompt and run:
npm run dev
Alternatively, use an approved PowerShell execution-policy setting for
your environment.
Backend connection error
- Confirm that the Spring Boot backend is running.
- Confirm that the backend port matches the URL in
  src/services/api.js.
- Check the browser Network tab for the failed API request.
CORS error
Make sure the backend allows requests from the frontend origin. For the
default Vite development server, the origin is commonly:
http://localhost:5173
401 Unauthorized or 403 Forbidden
- Sign in again to obtain a valid token.
- Confirm that the token is stored under localStorage key token.
- Confirm that the logged-in account has the required patient or
  doctor role.
- Check the backend Spring Security configuration and server logs.
Production Build
Create an optimized production build:
npm run build
Vite generates the production files in the dist/ directory.

To preview the build locally:
npm run preview
Developer Notes
- Keep backend API URLs in the shared API service rather than
  repeating them across components.
- Do not commit passwords, secret keys, or real JWT tokens.
- Ensure frontend route permissions and backend role-based
  authorization remain consistent.
- Confirm API response field names against the backend DTOs when
  integrating or updating pages.
