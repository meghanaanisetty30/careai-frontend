
import { useState } from "react";
import {
  HeartPulse,
  Send,
  AlertTriangle,
  Activity,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

function AIHealthAssistant() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("Today");
  const [severity, setSeverity] = useState("Mild");
  const [result, setResult] = useState(null);

  const analyzeSymptoms = (event) => {
    event.preventDefault();

    const text = symptoms.toLowerCase().trim();

    if (!text) return;

    let advice = {
      title: "General Health Guidance",
      message:
        "Your symptoms need to be understood in the context of your overall health. Monitor how you feel and consult a qualified healthcare professional if symptoms persist or worsen.",
      suggestions: [
        "Stay hydrated and get adequate rest.",
        "Monitor your symptoms and note any changes.",
        "Contact a healthcare professional for personalized advice.",
      ],
      emergency: false,
    };

    const emergencyKeywords = [
      "chest pain",
      "difficulty breathing",
      "shortness of breath",
      "cannot breathe",
      "unconscious",
      "severe bleeding",
      "stroke",
      "seizure",
    ];

    const hasEmergencySymptom = emergencyKeywords.some((keyword) =>
      text.includes(keyword)
    );

    if (hasEmergencySymptom) {
      advice = {
        title: "Urgent Medical Attention",
        message:
          "The symptoms you entered may indicate a medical emergency. Do not rely on this demo assistant. Seek emergency medical help immediately.",
        suggestions: [
          "Call India's emergency number 112 or your local emergency service.",
          "Do not drive yourself if you feel seriously unwell.",
          "Ask someone nearby to assist you while help is arranged.",
        ],
        emergency: true,
      };
    } else if (
      text.includes("fever") ||
      text.includes("cold") ||
      text.includes("cough") ||
      text.includes("sore throat")
    ) {
      advice = {
        title: "Fever and Cold Related Guidance",
        message:
          "These symptoms can occur with several common illnesses. This demo cannot identify the cause or determine whether treatment is needed.",
        suggestions: [
          "Drink enough fluids and get adequate rest.",
          "Monitor your temperature and symptom changes.",
          "Consult a healthcare professional if symptoms persist, worsen, or concern you.",
        ],
        emergency: false,
      };
    } else if (
      text.includes("headache") ||
      text.includes("migraine")
    ) {
      advice = {
        title: "Headache Related Guidance",
        message:
          "Headaches can have many causes. Consider your symptom pattern and seek medical advice if the headache is new, recurring, or worsening.",
        suggestions: [
          "Rest in a comfortable and quiet environment.",
          "Drink water and avoid skipping meals.",
          "Seek urgent medical attention for a sudden, extremely severe headache or headache with weakness, confusion, or vision changes.",
        ],
        emergency: false,
      };
    } else if (
      text.includes("stomach") ||
      text.includes("abdominal") ||
      text.includes("nausea") ||
      text.includes("vomit")
    ) {
      advice = {
        title: "Digestive Symptom Guidance",
        message:
          "Digestive symptoms can have many possible causes. The location, severity, and duration of pain are important when a clinician evaluates them.",
        suggestions: [
          "Drink fluids in small amounts if you feel nauseated.",
          "Avoid foods that seem to make your symptoms worse.",
          "Seek prompt medical care for severe or worsening abdominal pain, repeated vomiting, or blood in vomit or stool.",
        ],
        emergency: false,
      };
    }

    setResult(advice);
  };

  const resetForm = () => {
    setSymptoms("");
    setDuration("Today");
    setSeverity("Mild");
    setResult(null);
  };

  return (
    <div className="ai-assistant-page">
      <div className="appointments-header">
        <div>
          <span className="dashboard-tag">PATIENT WORKSPACE</span>
          <h1>AI Health Assistant</h1>
          <p>Share your symptoms to receive basic health guidance.</p>
        </div>
      </div>

      <div className="ai-assistant-intro">
        <div className="ai-assistant-icon">
          <HeartPulse size={30} />
        </div>
        <div>
          <h2>Your Health Companion</h2>
          <p>
            Describe how you are feeling. This demo provides general,
            educational guidance and does not diagnose medical conditions.
          </p>
        </div>
      </div>

      <div className="ai-assistant-content">
        <section className="ai-symptom-card">
          <div className="ai-section-heading">
            <Activity size={21} />
            <h2>Symptom Checker</h2>
          </div>

          <form onSubmit={analyzeSymptoms}>
            <label className="ai-form-label">
              Describe your symptoms
              <textarea
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                placeholder="Example: I have a headache and mild fever..."
                rows={5}
                required
              />
            </label>

            <div className="ai-form-grid">
              <label className="ai-form-label">
                How long have you had these symptoms?
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                >
                  <option>Today</option>
                  <option>1–2 days</option>
                  <option>3–7 days</option>
                  <option>More than a week</option>
                </select>
              </label>

              <label className="ai-form-label">
                How severe are your symptoms?
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value)}
                >
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
              </label>
            </div>

            <button type="submit" className="ai-analyze-button">
              <Send size={17} />
              Get Health Guidance
            </button>
          </form>
        </section>

        <section className="ai-result-card">
          <div className="ai-section-heading">
            <ShieldCheck size={21} />
            <h2>Health Guidance</h2>
          </div>

          {!result ? (
            <div className="ai-result-empty">
              <HeartPulse size={45} />
              <h3>Your guidance will appear here</h3>
              <p>Enter your symptoms and select Get Health Guidance.</p>
            </div>
          ) : (
            <div className="ai-result-content">
              <div
                className={
                  result.emergency
                    ? "ai-result-alert"
                    : "ai-result-normal"
                }
              >
                {result.emergency && <AlertTriangle size={23} />}
                <h3>{result.title}</h3>
              </div>

              <p className="ai-result-message">{result.message}</p>

              <div className="ai-result-details">
                <span>Duration: {duration}</span>
                <span>Severity selected: {severity}</span>
              </div>

              <h4>Suggested next steps</h4>
              <ul>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>

              <button
                className="ai-reset-button"
                onClick={resetForm}
                type="button"
              >
                <RotateCcw size={16} />
                Check Again
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="ai-disclaimer">
        <AlertTriangle size={19} />
        <p>
          <strong>Medical disclaimer:</strong> This is a rule-based demo,
          not a real AI medical service. It cannot diagnose, prescribe
          medication, or replace a doctor. For emergencies, seek immediate
          medical help.
        </p>
      </div>
    </div>
  );
}

export default AIHealthAssistant;
