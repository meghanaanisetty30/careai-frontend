
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FeaturePage from "./pages/FeaturePage";

import PatientAppointments from "./pages/PatientAppointments";
import PatientMedicalHistory from "./pages/PatientMedicalHistory";
import PatientMedicalReports from "./pages/PatientMedicalReports";
import AIHealthAssistant from "./pages/AIHealthAssistant";

import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorMedicalReports from "./pages/DoctorMedicalReports";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PATIENT ROUTES */}
      <Route element={<ProtectedRoute allowedRole="PATIENT" />}>
        <Route element={<AppLayout />}>
          <Route
            path="/patient/dashboard"
            element={<Dashboard role="PATIENT" />}
          />

          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />

          <Route
            path="/patient/medical-history"
            element={<PatientMedicalHistory />}
          />

          <Route
            path="/patient/medical-reports"
            element={<PatientMedicalReports />}
          />

          <Route
            path="/patient/ai-assistant"
            element={<AIHealthAssistant />}
          />
        </Route>
      </Route>

      {/* DOCTOR ROUTES */}
      <Route element={<ProtectedRoute allowedRole="DOCTOR" />}>
        <Route element={<AppLayout />}>
          <Route
            path="/doctor/dashboard"
            element={<Dashboard role="DOCTOR" />}
          />

          <Route
            path="/doctor/appointments"
            element={<DoctorAppointments />}
          />

          <Route
            path="/doctor/patients"
            element={<DoctorPatients />}
          />

          <Route
            path="/doctor/medical-reports"
            element={<DoctorMedicalReports />}
          />
        </Route>
      </Route>

      {/* UNAUTHORIZED */}
      <Route
        path="/unauthorized"
        element={
          <div className="feature-page">
            <h1>Access Denied</h1>
            <p>You are not authorized to access this page.</p>
          </div>
        }
      />

      {/* INVALID ROUTES */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
