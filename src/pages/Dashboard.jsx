
import { useEffect, useState } from "react";

import {
  CalendarDays,
  Users,
  FileText,
  HeartPulse,
  Clock,
  Activity,
  ArrowRight,
  Stethoscope,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../services/api";

// Format appointment/report date
const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// Format appointment time
const formatTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

function Dashboard({ role }) {
  const isDoctor = role === "DOCTOR";

  const [dashboardData, setDashboardData] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientReports, setPatientReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user information as a fallback
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  // Fetch dashboard information from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch patient or doctor dashboard
        const endpoint = isDoctor
          ? "/doctor/dashboard"
          : "/patient/dashboard";

        const response = await api.get(endpoint);

        setDashboardData(response.data);

        // Fetch additional information for patient
        if (!isDoctor) {
          try {
            const [appointmentsResponse, reportsResponse] =
              await Promise.all([
                api.get("/patient/dashboard/upcoming-appointments"),
                api.get("/patient/dashboard/recent-reports")
              ]);

            setPatientAppointments(
              Array.isArray(appointmentsResponse.data)
                ? appointmentsResponse.data
                : []
            );

            setPatientReports(
              Array.isArray(reportsResponse.data)
                ? reportsResponse.data
                : []
            );

          } catch (additionalError) {
            console.error(
              "Error loading patient appointments or reports:",
              additionalError
            );
          }
        }

      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load dashboard information. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isDoctor]);

  // Display name
  const userName = dashboardData
    ? (
        isDoctor
          ? dashboardData.doctorName
          : dashboardData.patientName
      )
    : (
        user.name ||
        user.fullName ||
        (isDoctor ? "Doctor" : "Patient")
      );

  // Patient overview cards
  const patientCards = [
    {
      title: "Total Appointments",
      value: dashboardData?.totalAppointments ?? 0,
      icon: CalendarDays
    },
    {
      title: "Upcoming Appointments",
      value: dashboardData?.upcomingAppointments ?? 0,
      icon: Clock
    },
    {
      title: "Medical Reports",
      value: dashboardData?.totalMedicalReports ?? 0,
      icon: FileText
    },
    {
      title: "Health Status",
      value: dashboardData?.healthStatus === "NOT_ASSESSED"
        ? "Not Assessed"
        : dashboardData?.healthStatus ?? "N/A",
      icon: Activity
    }
  ];

  // Doctor overview cards
  const doctorCards = [
    {
      title: "Total Patients",
      value: dashboardData?.totalPatients ?? 0,
      icon: Users
    },
    {
      title: "Today's Appointments",
      value: dashboardData?.todaysAppointments ?? 0,
      icon: CalendarDays
    },
    {
      title: "Pending Reports",
      value: dashboardData?.pendingReports ?? 0,
      icon: FileText
    },
    {
      title: "Completed Consultations",
      value: dashboardData?.completedConsultations ?? 0,
      icon: HeartPulse
    }
  ];

  const cards = isDoctor ? doctorCards : patientCards;

  return (
    <div className="dashboard">

      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-tag">
            {isDoctor ? "DOCTOR DASHBOARD" : "PATIENT DASHBOARD"}
          </span>

          <h1>Hello, {userName}!</h1>

          <p>
            {isDoctor
              ? "Manage your patients and appointments efficiently."
              : "Welcome to your personal healthcare dashboard."}
          </p>
        </div>

        <div className="welcome-icon">
          <HeartPulse size={48} />
        </div>
      </div>

      {/* Loading Message */}
      {loading && (
        <p>Loading dashboard information...</p>
      )}

      {/* Error Message */}
      {!loading && error && (
        <div className="dashboard-info-card">
          <p>{error}</p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="dashboard-section-heading">
        <h2>Overview</h2>
        <p>Here's a summary of your healthcare activity.</p>
      </div>

      <div className="dashboard-cards">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div className="dashboard-card" key={index}>
              <div className="dashboard-card-top">
                <div className="dashboard-card-icon">
                  <Icon size={23} />
                </div>
              </div>

              <h3>
                {loading ? "--" : card.value}
              </h3>

              <p>{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* PATIENT DASHBOARD CONTENT */}
      {!isDoctor && (
        <>
          {/* Quick Actions */}
          <div className="dashboard-section-heading">
            <h2>Quick Actions</h2>
            <p>Access your healthcare services quickly.</p>
          </div>

          <div className="quick-actions-grid">

            <Link to="/patient/appointments" className="quick-action-card">
              <div className="quick-action-icon">
                <Plus size={23} />
              </div>

              <div>
                <h3>Book Appointment</h3>
                <p>Schedule a consultation with a doctor.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/patient/medical-history" className="quick-action-card">
              <div className="quick-action-icon">
                <Activity size={23} />
              </div>

              <div>
                <h3>Medical History</h3>
                <p>View your previous health records.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/patient/medical-reports" className="quick-action-card">
              <div className="quick-action-icon">
                <FileText size={23} />
              </div>

              <div>
                <h3>Medical Reports</h3>
                <p>Access your medical test reports.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/patient/ai-assistant" className="quick-action-card">
              <div className="quick-action-icon">
                <HeartPulse size={23} />
              </div>

              <div>
                <h3>AI Health Assistant</h3>
                <p>Explore AI-powered health assistance.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

          </div>

          {/* Patient Appointments and Reports */}
          <div className="dashboard-content-grid">

            {/* Upcoming Appointments */}
            <div className="dashboard-info-card">

              <div className="content-card-heading">
                <div>
                  <h2>Upcoming Appointments</h2>
                  <p>Your scheduled doctor consultations</p>
                </div>

                <Link to="/patient/appointments" className="view-all-link">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="appointment-list">

                {loading ? (
                  <p>Loading appointments...</p>
                ) : patientAppointments.length === 0 ? (
                  <p>No upcoming appointments found.</p>
                ) : (
                  patientAppointments.map((appointment) => (
                    <div
                      className="appointment-item"
                      key={appointment.appointmentId}
                    >
                      <div className="appointment-icon">
                        <Stethoscope size={21} />
                      </div>

                      <div className="appointment-details">
                        <h3>{appointment.doctorName}</h3>

                        <p>{appointment.specialization}</p>

                        <span>
                          <CalendarDays size={14} />
                          {formatDate(appointment.appointmentDate)}

                          <Clock size={14} />
                          {formatTime(appointment.appointmentDate)}
                        </span>
                      </div>

                      <span
                        className={`appointment-status ${
                          appointment.status === "BOOKED"
                            ? "status-confirmed"
                            : "status-pending"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))
                )}

              </div>
            </div>

            {/* Recent Medical Reports */}
            <div className="dashboard-info-card">

              <div className="content-card-heading">
                <div>
                  <h2>Recent Medical Reports</h2>
                  <p>Your latest health documents</p>
                </div>

                <Link to="/patient/medical-reports" className="view-all-link">
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="report-list">

                {loading ? (
                  <p>Loading reports...</p>
                ) : patientReports.length === 0 ? (
                  <p>No medical reports found.</p>
                ) : (
                  patientReports.map((report) => (
                    <div
                      className="report-item"
                      key={report.reportId}
                    >
                      <div className="report-icon">
                        <FileText size={21} />
                      </div>

                      <div>
                        <h3>{report.reportName}</h3>
                        <p>
                          {report.reportType} · {formatDate(report.uploadedAt)}
                        </p>
                      </div>

                      <Link
                        to="/patient/medical-reports"
                        className="report-view-link"
                        aria-label={`View ${report.reportName}`}
                      >
                        <Eye size={19} />
                      </Link>
                    </div>
                  ))
                )}

              </div>
            </div>

          </div>
        </>
      )}

      {/* DOCTOR DASHBOARD CONTENT */}
      {isDoctor && (
        <>
          {/* Doctor Quick Actions */}
          <div className="dashboard-section-heading">
            <h2>Quick Actions</h2>
            <p>Manage your daily healthcare activities.</p>
          </div>

          <div className="quick-actions-grid">

            <Link to="/doctor/appointments" className="quick-action-card">
              <div className="quick-action-icon">
                <CalendarDays size={23} />
              </div>

              <div>
                <h3>Manage Appointments</h3>
                <p>View and manage patient appointments.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/doctor/patients" className="quick-action-card">
              <div className="quick-action-icon">
                <Users size={23} />
              </div>

              <div>
                <h3>View Patients</h3>
                <p>Access your patient information.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/doctor/medical-reports" className="quick-action-card">
              <div className="quick-action-icon">
                <FileText size={23} />
              </div>

              <div>
                <h3>Medical Reports</h3>
                <p>Review patient medical reports.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

          </div>

          {/* Doctor Appointment Summary */}
          <div className="dashboard-info-card doctor-appointments-card">

            <div className="content-card-heading">
              <div>
                <h2>Today's Appointments</h2>
                <p>Your scheduled patient consultations</p>
              </div>

              <Link to="/doctor/appointments" className="view-all-link">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="appointment-list">
              {loading ? (
                <p>Loading appointment summary...</p>
              ) : (
                <div className="appointment-item">
                  <div className="appointment-icon">
                    <CalendarDays size={21} />
                  </div>

                  <div className="appointment-details">
                    <h3>
                      {dashboardData?.todaysAppointments ?? 0} Appointments
                    </h3>

                    <p>Scheduled for today</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Doctor Daily Tasks */}
          <div className="dashboard-info-card doctor-task-card">

            <div className="task-heading-icon">
              <ClipboardList size={23} />
            </div>

            <div>
              <h2>Daily Tasks</h2>

              <p>
                <CheckCircle size={16} />
                Review scheduled consultations
              </p>

              <p>
                <AlertCircle size={16} />
                Check pending medical reports
              </p>
            </div>

          </div>
        </>
      )}

      {/* Footer Information */}
      <div className="dashboard-bottom">

        <div className="dashboard-info-card">
          <h2>Quick Overview</h2>

          <p>
            {isDoctor
              ? "Your healthcare workspace is ready. Manage appointments, patients and medical reports from the sidebar."
              : "Your healthcare workspace is ready. Manage appointments, view medical history and explore AI health assistance from the sidebar."}
          </p>
        </div>

        <div className="dashboard-info-card">
          <h2>CareAI Assistant</h2>

          <p>
            Get intelligent healthcare assistance and understand
            medical information with ease.
          </p>

          <span className="dashboard-status">
            Healthcare assistance available
          </span>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
