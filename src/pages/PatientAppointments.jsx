import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import api from "../services/api";

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: ""
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentResponse, doctorResponse] = await Promise.all([
        api.get("/appointments/my"),
        api.get("/appointments/doctors")
      ]);

      setAppointments(appointmentResponse.data);
      setDoctors(doctorResponse.data);
    } catch (err) {
      console.error("Unable to load appointments:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.doctorId || !form.date || !form.time || !form.reason.trim()) {
      setError("Please complete all fields.");
      return;
    }

    const selectedDateTime = new Date(`${form.date}T${form.time}`);

    if (selectedDateTime <= new Date()) {
      setError("Please select a future date and time.");
      return;
    }

    try {
      const requestData = {
        doctorId: Number(form.doctorId),
        appointmentDate: `${form.date}T${form.time}:00`,
        reason: form.reason.trim()
      };

      await api.post("/appointments", requestData);

      setForm({
        doctorId: "",
        date: "",
        time: "",
        reason: ""
      });

      setShowForm(false);
      setMessage("Appointment booked successfully!");

      await loadPageData();
    } catch (err) {
      console.error("Booking failed:", err);
      setError(
        err.response?.data?.message ||
        "Unable to book appointment. Please try again."
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!shouldCancel) return;

    try {
      setError("");
      await api.put(`/appointments/${appointmentId}/cancel`);

      setMessage("Appointment cancelled successfully.");
      await loadPageData();
    } catch (err) {
      console.error("Cancellation failed:", err);
      setError(
        err.response?.data?.message ||
        "Unable to cancel appointment."
      );
    }
  };

  const activeAppointments = appointments.filter(
    (appointment) => appointment.status !== "CANCELLED"
  );

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  );

  const getStatusIcon = (status) => {
    if (status === "CONFIRMED") return <CheckCircle size={15} />;
    if (status === "CANCELLED" || status === "REJECTED") {
      return <XCircle size={15} />;
    }
    return <AlertCircle size={15} />;
  };

  if (loading) {
    return <div className="appointments-page">Loading appointments...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">PATIENT WORKSPACE</span>
          <h1>My Appointments</h1>
          <p>Book consultations and manage your doctor appointments.</p>
        </div>

        <button
          className="appointment-primary-button"
          onClick={() => {
            setMessage("");
            setError("");
            setShowForm(!showForm);
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close Form" : "Book Appointment"}
        </button>
      </div>

      {message && <div className="appointment-message">{message}</div>}
      {error && <div className="appointment-message">{error}</div>}

      {showForm && (
        <div className="appointment-form-card">
          <div className="appointment-form-heading">
            <div className="appointment-form-icon">
              <CalendarDays size={22} />
            </div>
            <div>
              <h2>Book a New Appointment</h2>
              <p>Enter your details to schedule a consultation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="appointment-form-grid">
              <div className="appointment-form-group">
                <label htmlFor="doctorId">Select Doctor</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={updateForm}
                  required
                >
                  <option value="">Choose a doctor</option>

                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-form-group">
                <label htmlFor="appointment-date">Appointment Date</label>
                <input
                  id="appointment-date"
                  type="date"
                  name="date"
                  min={getLocalDate()}
                  value={form.date}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="appointment-form-group">
                <label htmlFor="appointment-time">Appointment Time</label>
                <input
                  id="appointment-time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="appointment-form-group">
                <label htmlFor="appointment-reason">Reason for Visit</label>
                <input
                  id="appointment-reason"
                  type="text"
                  name="reason"
                  placeholder="Enter reason for consultation"
                  value={form.reason}
                  onChange={updateForm}
                  maxLength={150}
                  required
                />
              </div>
            </div>

            <div className="appointment-form-actions">
              <button
                type="button"
                className="appointment-secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="appointment-primary-button">
                <CalendarDays size={17} />
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="appointment-summary-grid">
        <div className="appointment-summary-card">
          <CalendarDays size={22} />
          <div>
            <h3>{appointments.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <Clock size={22} />
          <div>
            <h3>
              {appointments.filter((item) => item.status === "BOOKED").length}
            </h3>
            <p>Booked</p>
          </div>
        </div>

        <div className="appointment-summary-card">
          <CheckCircle size={22} />
          <div>
            <h3>
              {appointments.filter((item) => item.status === "CONFIRMED").length}
            </h3>
            <p>Confirmed</p>
          </div>
        </div>
      </div>

      <div className="appointment-list-card">
        <div className="appointment-page-section-heading">
          <div>
            <h2>Upcoming and Active Appointments</h2>
            <p>Your appointments with doctors.</p>
          </div>
        </div>

        {activeAppointments.length === 0 ? (
          <div className="appointment-empty-state">
            <CalendarDays size={42} />
            <h3>No appointments yet</h3>
            <p>Book an appointment to see it listed here.</p>
          </div>
        ) : (
          <div className="appointment-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {activeAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="appointment-doctor-cell">
                        <Stethoscope size={17} />
                        {appointment.doctorName}
                      </div>
                    </td>

                    <td>{appointment.specialty}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{formatTime(appointment.appointmentDate)}</td>
                    <td>{appointment.reason || "Not specified"}</td>

                    <td>
                      <span
                        className={`appointment-status status-${appointment.status.toLowerCase()}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {displayStatus(appointment.status)}
                      </span>
                    </td>

                    <td>
                      {appointment.status !== "CANCELLED" &&
                        appointment.status !== "REJECTED" && (
                          <button
                            className="appointment-cancel-button"
                            onClick={() => cancelAppointment(appointment.id)}
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cancelledAppointments.length > 0 && (
        <div className="appointment-list-card cancelled-appointments-card">
          <div className="appointment-page-section-heading">
            <div>
              <h2>Cancelled Appointments</h2>
              <p>Your previously cancelled bookings.</p>
            </div>
          </div>

          {cancelledAppointments.map((appointment) => (
            <div className="cancelled-appointment-item" key={appointment.id}>
              <div>
                <strong>{appointment.doctorName}</strong>
                <span>
                  {formatDate(appointment.appointmentDate)} ·{" "}
                  {formatTime(appointment.appointmentDate)}
                </span>
              </div>

              <span className="appointment-status status-cancelled">
                <XCircle size={15} />
                Cancelled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;