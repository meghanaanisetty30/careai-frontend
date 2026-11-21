
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  HeartPulse,
  Pill,
  AlertCircle,
  CalendarDays
} from "lucide-react";

function PatientMedicalHistory() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    condition: "",
    category: "Medical Condition",
    diagnosisDate: "",
    doctor: "",
    notes: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const patientEmail = user.email || "demo-patient";

  useEffect(() => {
    const allRecords = JSON.parse(
      localStorage.getItem("careaiMedicalHistory") || "[]"
    );

    setRecords(
      allRecords.filter((record) => record.patientEmail === patientEmail)
    );
  }, [patientEmail]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.condition.trim() || !form.diagnosisDate) {
      alert("Please enter the condition and diagnosis date.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      patientEmail,
      condition: form.condition.trim(),
      category: form.category,
      diagnosisDate: form.diagnosisDate,
      doctor: form.doctor.trim(),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString()
    };

    const allRecords = JSON.parse(
      localStorage.getItem("careaiMedicalHistory") || "[]"
    );

    const updatedRecords = [...allRecords, newRecord];

    localStorage.setItem(
      "careaiMedicalHistory",
      JSON.stringify(updatedRecords)
    );

    setRecords((previous) => [...previous, newRecord]);

    setForm({
      condition: "",
      category: "Medical Condition",
      diagnosisDate: "",
      doctor: "",
      notes: ""
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    const allRecords = JSON.parse(
      localStorage.getItem("careaiMedicalHistory") || "[]"
    );

    const updatedRecords = allRecords.filter(
      (record) => record.id !== id
    );

    localStorage.setItem(
      "careaiMedicalHistory",
      JSON.stringify(updatedRecords)
    );

    setRecords((previous) =>
      previous.filter((record) => record.id !== id)
    );
  };

  const getIcon = (category) => {
    if (category === "Medication") return <Pill size={20} />;
    if (category === "Allergy") return <AlertCircle size={20} />;
    return <HeartPulse size={20} />;
  };

  return (
    <div className="medical-history-page">
      <div className="medical-history-header">
        <div>
          <span className="dashboard-tag">PATIENT RECORDS</span>
          <h1>Medical History</h1>
          <p>Maintain and review your previous medical records.</p>
        </div>

        <button
          className="history-add-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          {showForm ? "Close Form" : "Add Record"}
        </button>
      </div>

      <div className="history-summary-grid">
        <div className="history-summary-card">
          <ClipboardList size={25} />
          <div>
            <h2>{records.length}</h2>
            <p>Total Records</p>
          </div>
        </div>

        <div className="history-summary-card">
          <HeartPulse size={25} />
          <div>
            <h2>
              {records.filter(
                (record) => record.category === "Medical Condition"
              ).length}
            </h2>
            <p>Medical Conditions</p>
          </div>
        </div>

        <div className="history-summary-card">
          <Pill size={25} />
          <div>
            <h2>
              {records.filter(
                (record) => record.category === "Medication"
              ).length}
            </h2>
            <p>Medication Records</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="history-form-card">
          <h2>Add Medical Record</h2>

          <form onSubmit={handleSubmit}>
            <div className="history-form-grid">
              <div className="history-form-group">
                <label>Condition / Record Name *</label>
                <input
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  placeholder="Enter condition or record name"
                  required
                />
              </div>

              <div className="history-form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Medical Condition</option>
                  <option>Allergy</option>
                  <option>Medication</option>
                  <option>Surgery</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="history-form-group">
                <label>Diagnosis / Record Date *</label>
                <input
                  type="date"
                  name="diagnosisDate"
                  value={form.diagnosisDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="history-form-group">
                <label>Doctor / Hospital</label>
                <input
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  placeholder="Enter doctor or hospital name"
                />
              </div>

              <div className="history-form-group history-full-width">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add any additional information..."
                  rows="3"
                />
              </div>
            </div>

            <div className="history-form-actions">
              <button type="submit" className="history-add-button">
                Save Record
              </button>
              <button
                type="button"
                className="history-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="history-records-section">
        <div className="history-section-heading">
          <div>
            <h2>Your Medical Records</h2>
            <p>Records you have added to your profile</p>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="history-empty-state">
            <ClipboardList size={42} />
            <h3>No Medical Records Yet</h3>
            <p>Add your medical history to keep your records organized.</p>
            <button
              className="history-add-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add Your First Record
            </button>
          </div>
        ) : (
          <div className="history-record-list">
            {[...records]
              .sort(
                (a, b) =>
                  new Date(b.diagnosisDate) - new Date(a.diagnosisDate)
              )
              .map((record) => (
                <div className="history-record-card" key={record.id}>
                  <div className="history-record-icon">
                    {getIcon(record.category)}
                  </div>

                  <div className="history-record-details">
                    <div className="history-record-title">
                      <h3>{record.condition}</h3>
                      <span>{record.category}</span>
                    </div>

                    <p className="history-record-date">
                      <CalendarDays size={15} />
                      {new Date(record.diagnosisDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </p>

                    {record.doctor && (
                      <p>Doctor / Hospital: {record.doctor}</p>
                    )}

                    {record.notes && (
                      <p className="history-record-notes">
                        {record.notes}
                      </p>
                    )}
                  </div>

                  <button
                    className="history-delete-button"
                    onClick={() => handleDelete(record.id)}
                    title="Delete record"
                    aria-label="Delete record"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="history-demo-note">
        <AlertCircle size={18} />
        <p>
          Demo only: records are stored in this browser. Do not enter real
          or sensitive medical information. Secure backend storage and
          access controls are required for actual patient records.
        </p>
      </div>
    </div>
  );
}

export default PatientMedicalHistory;
