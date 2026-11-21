
import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  CalendarDays,
  Download,
  X,
  CheckCircle,
} from "lucide-react";

function DoctorMedicalReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("careaiReports") || "[]");
    setReports(saved);
  }, []);

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const reviewedCount = reports.filter(
    (report) => report.status === "Reviewed"
  ).length;

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (report.reportName || "").toLowerCase().includes(search.toLowerCase()) ||
      (report.patientEmail || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || report.status === filter;

    return matchesSearch && matchesFilter;
  });

  const markReviewed = (id) => {
    const updated = reports.map((report) =>
      report.id === id ? { ...report, status: "Reviewed" } : report
    );

    setReports(updated);
    localStorage.setItem("careaiReports", JSON.stringify(updated));

    setSelectedReport((previous) =>
      previous?.id === id ? { ...previous, status: "Reviewed" } : previous
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="doctor-reports-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">DOCTOR WORKSPACE</span>
          <h1>Medical Reports</h1>
          <p>Review medical documents submitted by patients.</p>
        </div>
      </div>

      <div className="appointment-summary-grid">
        <div className="appointment-summary-card">
          <div className="appointment-summary-icon"><FileText /></div>
          <div><span>Total Reports</span><h2>{reports.length}</h2></div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon"><CalendarDays /></div>
          <div><span>Pending Review</span><h2>{pendingCount}</h2></div>
        </div>

        <div className="appointment-summary-card">
          <div className="appointment-summary-icon"><CheckCircle /></div>
          <div><span>Reviewed</span><h2>{reviewedCount}</h2></div>
        </div>
      </div>

      <section className="doctor-reports-section">
        <div className="doctor-reports-toolbar">
          <div>
            <h2>Patient Submitted Reports</h2>
            <p>Open a report to view or download the uploaded document.</p>
          </div>

          <div className="doctor-report-controls">
            <div className="doctor-report-search">
              <Search size={18} />
              <input
                placeholder="Search patient or report..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="doctor-report-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Reports</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="appointment-empty-state">
            <FileText size={42} />
            <h3>No reports found</h3>
            <p>Patient uploads will appear here.</p>
          </div>
        ) : (
          <div className="doctor-reports-list">
            {filteredReports.map((report) => (
              <article className="doctor-report-card" key={report.id}>
                <div className="doctor-report-icon">
                  <FileText size={25} />
                </div>

                <div className="doctor-report-info">
                  <h3>{report.reportName}</h3>
                  <p>{report.patientName} · {report.patientEmail}</p>
                  <div className="doctor-report-meta">
                    <span>{report.category}</span>
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(report.uploadedAt)}
                    </span>
                  </div>
                </div>

                <div className="doctor-report-actions">
                  <span
                    className={`appointment-status ${
                      report.status === "Reviewed"
                        ? "status-confirmed"
                        : "status-pending"
                    }`}
                  >
                    {report.status}
                  </span>

                  <button
                    className="doctor-report-view-button"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye size={16} /> View
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedReport && (
        <div
          className="doctor-report-modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="doctor-report-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="doctor-report-modal-header">
              <div>
                <span className="dashboard-tag">PATIENT REPORT</span>
                <h2>{selectedReport.reportName}</h2>
              </div>

              <button
                className="doctor-report-close"
                onClick={() => setSelectedReport(null)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="doctor-report-modal-content">
              <div>
                <span>Patient</span>
                <strong>{selectedReport.patientName}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedReport.patientEmail}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selectedReport.category}</strong>
              </div>

              <div>
                <span>Uploaded</span>
                <strong>{formatDate(selectedReport.uploadedAt)}</strong>
              </div>

              <div className="doctor-report-description">
                <span>Uploaded File</span>
                <strong>{selectedReport.fileName}</strong>
              </div>
            </div>

            <div className="doctor-report-modal-actions">
              <a
                href={selectedReport.fileData}
                target="_blank"
                rel="noreferrer"
                className="doctor-report-download-button"
              >
                <Eye size={17} /> Open File
              </a>

              <a
                href={selectedReport.fileData}
                download={selectedReport.fileName}
                className="doctor-report-download-button"
              >
                <Download size={17} /> Download
              </a>
            </div>

            {selectedReport.status === "Pending" ? (
              <button
                className="appointment-approve-button doctor-report-review-button"
                onClick={() => markReviewed(selectedReport.id)}
              >
                <CheckCircle size={17} /> Mark as Reviewed
              </button>
            ) : (
              <p className="doctor-report-reviewed-message">
                This report has been marked as reviewed.
              </p>
            )}
          </div>
        </div>
      )}

      <p className="appointment-demo-note">
        Demo only: uploaded files are stored in browser localStorage.
      </p>
    </div>
  );
}

export default DoctorMedicalReports;
