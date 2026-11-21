
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserRound,
  CalendarDays,
  Clock,
  Mail,
  ClipboardList,
  Users,
} from "lucide-react";

function DoctorPatients() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("careaiAppointments") || "[]"
    );

    setAppointments(saved);
  }, []);

  // Only patients with confirmed appointments
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  );

  // Create one patient entry per email address
  const patients = useMemo(() => {
    const patientMap = new Map();

    confirmedAppointments.forEach((appointment) => {
      const email = appointment.patientEmail || appointment.patientName;

      if (!patientMap.has(email)) {
        patientMap.set(email, {
          name: appointment.patientName || "Patient",
          email: appointment.patientEmail || "Not available",
          appointments: [],
        });
      }

      patientMap.get(email).appointments.push(appointment);
    });

    return Array.from(patientMap.values());
  }, [appointments]);

  const filteredPatients = patients.filter((patient) => {
    const searchValue = search.toLowerCase();

    return (
      patient.name.toLowerCase().includes(searchValue) ||
      patient.email.toLowerCase().includes(searchValue)
    );
  });

  const totalConfirmed = confirmedAppointments.length;

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="doctor-patients-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">DOCTOR WORKSPACE</span>
          <h1>My Patients</h1>
          <p>View patients with confirmed appointments.</p>
        </div>
      </div>

      <div className="appointment-summary-grid">
        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <Users />
          </div>
          <div>
            <span>Total Patients</span>
            <h2>{patients.length}</h2>
          </div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon">
            <CalendarDays />
          </div>
          <div>
            <span>Confirmed Appointments</span>
            <h2>{totalConfirmed}</h2>
          </div>
        </div>
      </div>

      <section className="doctor-patients-section">
        <div className="doctor-patients-heading">
          <div>
            <h2>Patient Directory</h2>
            <p>Patients with approved appointment requests.</p>
          </div>

          <div className="doctor-patient-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="appointment-empty-state">
            <UserRound size={42} />
            <h3>No patients found</h3>
            <p>
              {patients.length === 0
                ? "Confirmed patient appointments will appear here."
                : "Try searching with a different name or email."}
            </p>
          </div>
        ) : (
          <div className="doctor-patients-grid">
            {filteredPatients.map((patient) => (
              <article className="doctor-patient-card" key={patient.email}>
                <div className="doctor-patient-card-header">
                  <div className="doctor-patient-avatar">
                    <UserRound size={27} />
                  </div>

                  <div>
                    <h3>{patient.name}</h3>
                    <p>
                      <Mail size={14} />
                      {patient.email}
                    </p>
                  </div>
                </div>

                <div className="doctor-patient-count">
                  <ClipboardList size={17} />
                  <span>
                    {patient.appointments.length} confirmed appointment
                    {patient.appointments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="doctor-patient-appointments">
                  <h4>Appointment Details</h4>

                  {patient.appointments.map((appointment) => (
                    <div
                      className="doctor-patient-appointment-item"
                      key={appointment.id}
                    >
                      <strong>{appointment.doctorName}</strong>
                      <span>{appointment.specialty}</span>

                      <div>
                        <CalendarDays size={14} />
                        {formatDate(appointment.date)}
                      </div>

                      <div>
                        <Clock size={14} />
                        {appointment.time || "Not specified"}
                      </div>
                    </div>
                  ))}
                </div>

                <span className="appointment-status status-confirmed">
                  Confirmed Patient
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="appointment-demo-note">
        Demo mode: patient information is loaded from this browser's saved
        appointment records.
      </p>
    </div>
  );
}

export default DoctorPatients;
