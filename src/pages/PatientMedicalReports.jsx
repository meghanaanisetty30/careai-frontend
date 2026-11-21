
import { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  CalendarDays,
  Download,
} from "lucide-react";

function PatientMedicalReports() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const patientEmail = user.email || "demo-patient";

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Blood Test");
  const [reportName, setReportName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("careaiReports") || "[]");
    setReports(saved.filter((report) => report.patientEmail === patientEmail));
  }, [patientEmail]);

  const saveReports = (updated) => {
    const allReports = JSON.parse(
      localStorage.getItem("careaiReports") || "[]"
    );
    const otherReports = allReports.filter(
      (report) => report.patientEmail !== patientEmail
    );

    localStorage.setItem(
      "careaiReports",
      JSON.stringify([...otherReports, ...updated])
    );
    setReports(updated);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const fileInput = event.target.elements.reportFile;
    const file = fileInput.files[0];

    if (!file || !reportName.trim()) {
      setMessage("Please enter a report name and select a file.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only PDF, JPG and PNG files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const newReport = {
        id: Date.now(),
        patientEmail,
        patientName: user.name || user.fullName || "Patient",
        reportName: reportName.trim(),
        category,
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result,
        uploadedAt: new Date().toISOString(),
        status: "Pending",
      };

      try {
        saveReports([...reports, newReport]);
        setReportName("");
        setMessage("Report uploaded successfully!");
        event.target.reset();
      } catch {
        setMessage("Storage limit reached. Try uploading a smaller file.");
      }
    };

    reader.onerror = () => setMessage("Unable to read this file.");
    reader.readAsDataURL(file);
  };

  const deleteReport = (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    saveReports(reports.filter((report) => report.id !== id));
    setMessage("Report deleted successfully.");
  };

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-reports-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">PATIENT WORKSPACE</span>
          <h1>Medical Reports</h1>
          <p>Upload and manage your medical documents.</p>
        </div>
      </div>

      <section className="patient-report-upload">
        <div className="patient-report-heading">
          <Upload size={22} />
          <div>
            <h2>Upload Medical Report</h2>
            <p>Supported formats: PDF, JPG and PNG. Maximum size: 2 MB.</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="patient-report-form">
          <label>
            Report Name
            <input
              value={reportName}
              onChange={(event) => setReportName(event.target.value)}
              placeholder="e.g. Blood Test Report"
              required
            />
          </label>

          <label>
            Report Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Blood Test</option>
              <option>Imaging</option>
              <option>Prescription</option>
              <option>General Checkup</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Select File
            <input
              type="file"
              name="reportFile"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </label>

          <button type="submit" className="appointment-primary-button">
            <Upload size={17} />
            Upload Report
          </button>
        </form>

        {message && <p className="appointment-message">{message}</p>}
      </section>

      <section className="patient-report-list-section">
        <div className="doctor-patients-heading">
          <div>
            <h2>My Uploaded Reports</h2>
            <p>{reports.length} report(s) uploaded</p>
          </div>

          <div className="doctor-patient-search">
            <Search size={18} />
            <input
              placeholder="Search reports..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="appointment-empty-state">
            <FileText size={42} />
            <h3>No reports found</h3>
            <p>Your uploaded medical reports will appear here.</p>
          </div>
        ) : (
          <div className="patient-report-list">
            {filteredReports.map((report) => (
              <div className="patient-report-item" key={report.id}>
                <div className="doctor-report-icon">
                  <FileText size={24} />
                </div>

                <div className="patient-report-details">
                  <h3>{report.reportName}</h3>
                  <p>{report.fileName}</p>
                  <span>{report.category}</span>
                  <small>
                    <CalendarDays size={13} />
                    {new Date(report.uploadedAt).toLocaleDateString("en-IN")}
                  </small>
                </div>

                <div className="patient-report-item-actions">
                  <span className="appointment-status status-pending">
                    {report.status}
                  </span>

                  <a
                    href={report.fileData}
                    download={report.fileName}
                    className="patient-report-download"
                    aria-label="Download report"
                  >
                    <Download size={17} />
                  </a>

                  <button
                    className="patient-report-delete"
                    onClick={() => deleteReport(report.id)}
                    aria-label="Delete report"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="appointment-demo-note">
        Demo only: reports are stored in this browser. Do not upload real or
        sensitive medical records.
      </p>
    </div>
  );
}

export default PatientMedicalReports;
