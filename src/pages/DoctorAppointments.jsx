import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  CheckCircle,
  XCircle,
  ClipboardList,
  Filter
} from "lucide-react";
import api from "../services/api";

function formatDate(dateTime) {
  if (!dateTime) return "Not specified";

  return new Date(dateTime).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatTime(dateTime) {
  if (!dateTime) return "Not specified";

  return new Date(dateTime).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function displayStatus(status) {
  const statuses = {
    BOOKED: "Booked",
    CONFIRMED: "Confirmed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled"
  };

  return statuses[status] || status;
}

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/doctor");
      setAppointments(response.data);
    } catch (err) {
      console.error("Unable to load doctor appointments:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setError("");
      setMessage("");

      await api.put(
        `/appointments/${id}/status`,
        null,
        {
          params: {
            status: newStatus
          }
        }
      );

      setMessage(
        newStatus === "CONFIRMED"
          ? "Appointment accepted successfully."
          : "Appointment rejected successfully."
      );

      await loadAppointments();
    } catch (err) {
      console.error("Unable to update appointment:", err);
      setError(
        err.response?.data?.message ||
        "Unable to update appointment status."
      );
    }
  };

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === filter
        );

  const bookedCount = appointments.filter(
    (appointment) => appointment.status === "BOOKED"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const rejectedCount = appointments.filter(
    (appointment) => appointment.status === "REJECTED"
  ).length;

  if (loading) {
    return (
      <div className="doctor-appointments-page">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="doctor-appointments-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">DOCTOR WORKSPACE</span>
          <h1>Appointments</h1>
          <p>Review patient bookings and manage your appointments.</p>
        </div>
      </div>

      {message && <div className="appointment-message">{message}</div>}
      {error && <div className="appointment-message">{error}</div>}

      <div className="appointment-summary-grid">
        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <ClipboardList />
          </div>
          <div>
            <span>Total Appointments</span>
            <h2>{appointments.length}</h2>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <Clock />
          </div>
          <div>
            <span>New Bookings</span>
            <h2>{bookedCount}</h2>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <CheckCircle />
          </div>
          <div>
            <span>Confirmed</span>
            <h2>{confirmedCount}</h2>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <XCircle />
          </div>
          <div>
            <span>Rejected</span>
            <h2>{rejectedCount}</h2>
          </div>
        </div>
      </div>

      <section className="doctor-appointment-section">
        <div className="doctor-appointment-toolbar">
          <div>
            <h2>Patient Appointments</h2>
            <p>View patient details and update appointment status.</p>
          </div>

          <div className="doctor-appointment-filter">
            <Filter size={18} />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Appointments</option>
              <option value="BOOKED">Booked</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="appointment-empty-state">
            <CalendarDays size={42} />
            <h3>No appointments found</h3>
            <p>
              {filter === "All"
                ? "Patient bookings will appear here."
                : `There are no ${displayStatus(filter).toLowerCase()} appointments.`}
            </p>
          </div>
        ) : (
          <div className="doctor-appointment-list">
            {filteredAppointments.map((appointment) => (
              <article
                className="doctor-appointment-card"
                key={appointment.id}
              >
                <div className="doctor-appointment-card-top">
                  <div className="doctor-patient-info">
                    <div className="appointment-doctor-avatar">
                      <UserRound size={23} />
                    </div>

                    <div>
                      <h3>{appointment.patientName || "Patient"}</h3>
                      <p>{appointment.patientEmail || "Email not available"}</p>
                    </div>
                  </div>

                  <span
                    className={`appointment-status status-${appointment.status.toLowerCase()}`}
                  >
                    {displayStatus(appointment.status)}
                  </span>
                </div>

                <div className="doctor-appointment-details">
                  <div>
                    <span>Doctor</span>
                    <strong>{appointment.doctorName}</strong>
                  </div>

                  <div>
                    <span>Specialty</span>
                    <strong>{appointment.specialty}</strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>
                      <CalendarDays size={15} />
                      {formatDate(appointment.appointmentDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>
                    <strong>
                      <Clock size={15} />
                      {formatTime(appointment.appointmentDate)}
                    </strong>
                  </div>
                </div>

                <div className="doctor-appointment-reason">
                  <span>Reason for appointment</span>
                  <p>{appointment.reason || "No reason provided."}</p>
                </div>

                {appointment.status === "BOOKED" && (
                  <div className="doctor-appointment-actions">
                    <button
                      className="appointment-approve-button"
                      onClick={() =>
                        updateStatus(appointment.id, "CONFIRMED")
                      }
                    >
                      <CheckCircle size={17} />
                      Accept Appointment
                    </button>

                    <button
                      className="appointment-reject-button"
                      onClick={() =>
                        updateStatus(appointment.id, "REJECTED")
                      }
                    >
                      <XCircle size={17} />
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorAppointments;