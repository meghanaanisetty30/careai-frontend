
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HeartPulse,
  UserRound,
  Stethoscope,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";

import {
  registerPatient,
  registerDoctor
} from "../services/authService";

// =====================================
// REUSABLE INPUT COMPONENT
// =====================================

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  min,
  maxLength,
  value,
  onChange
}) => (
  <div className="form-group">

    <label htmlFor={name}>{label}</label>

    <div className="input-wrapper">

      {Icon && <Icon size={18} className="input-icon" />}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        maxLength={maxLength}
        required
        autoComplete="off"
      />

    </div>

  </div>
);

// =====================================
// REUSABLE SELECT COMPONENT
// =====================================

const SelectField = ({
  label,
  name,
  options,
  value,
  onChange
}) => (
  <div className="form-group">

    <label htmlFor={name}>{label}</label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
    >

      <option value="">Select {label}</option>

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}

    </select>

  </div>
);

// =====================================
// REGISTER COMPONENT
// =====================================

function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const initialForm = {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address: "",
    specialization: "",
    qualification: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
    password: "",
    confirmPassword: ""
  };

  const [form, setForm] = useState(initialForm);

  // =====================================
  // HANDLE INPUT CHANGES
  // =====================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  // =====================================
  // HANDLE ROLE CHANGE
  // =====================================

  const handleRoleChange = (selectedRole) => {

    setRole(selectedRole);

    setError("");
    setSuccess("");
  };

  // =====================================
  // HANDLE FORM SUBMISSION
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Full name validation
    if (form.fullName.trim().length < 3) {

      setError("Please enter a valid full name.");
      return;
    }

    // Email validation
    const normalizedEmail = form.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {

      setError("Please enter a valid email address.");
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(form.phone)) {

      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    // Patient validation
    if (role === "PATIENT") {

      if (
        !form.dob ||
        !form.gender ||
        !form.bloodGroup ||
        !form.address.trim()
      ) {

        setError("Please complete all personal information.");
        return;
      }
    }

    // Doctor validation
    if (role === "DOCTOR") {

      if (
        !form.specialization.trim() ||
        !form.qualification.trim() ||
        !form.licenseNumber.trim() ||
        form.experience === "" ||
        form.consultationFee === ""
      ) {

        setError("Please complete all doctor information.");
        return;
      }

      if (
        Number(form.experience) < 0 ||
        Number(form.consultationFee) < 0
      ) {

        setError(
          "Experience and consultation fee cannot be negative."
        );

        return;
      }
    }

    // Password validation
    if (form.password.length < 8) {

      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {

      setError("Passwords do not match!");
      return;
    }

    // =====================================
    // PREPARE COMMON DATA
    // =====================================

    const commonData = {

      name: form.fullName.trim(),

      email: normalizedEmail,

      phoneNumber: form.phone,

      password: form.password,

      confirmPassword: form.confirmPassword

    };

    try {

      setLoading(true);

      let response;

      // =====================================
      // PATIENT REGISTRATION
      // =====================================

      if (role === "PATIENT") {

        const patientData = {

          ...commonData,

          dateOfBirth: form.dob,

          gender: form.gender,

          bloodGroup: form.bloodGroup,

          address: form.address.trim()

        };

        console.log("Patient Registration Data:", patientData);

        response = await registerPatient(patientData);

      }

      // =====================================
      // DOCTOR REGISTRATION
      // =====================================

      else {

        const doctorData = {

          ...commonData,

          specialization: form.specialization.trim(),

          qualification: form.qualification.trim(),

          medicalLicenseNumber: form.licenseNumber.trim(),

          yearsOfExperience: Number(form.experience),

          consultationFee: Number(form.consultationFee)

        };

        console.log("Doctor Registration Data:", doctorData);

        response = await registerDoctor(doctorData);

      }

      // =====================================
      // SUCCESS RESPONSE
      // =====================================

      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "Registration successful!"
      );

      setForm(initialForm);

      // Navigate to login after successful registration
      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (err) {

      console.error("Registration error:", err);

      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : err.message) ||
        "Registration failed. Please try again.";

      setError(errorMessage);

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // JSX
  // =====================================

  return (

    <div className="register-page">

      {/* LEFT SECTION */}

      <div className="register-left">

        <div className="brand">

          <div className="brand-icon">
            <HeartPulse size={28} />
          </div>

          <span>CareAI</span>

        </div>

        <div className="left-content">

          <span className="welcome-tag">
            <Activity size={16} />
            SMART HEALTHCARE PLATFORM
          </span>

          <h1>
            Your Health,
            <br />
            <span>Our Priority.</span>
          </h1>

          <p>
            Join CareAI and experience smarter healthcare
            with AI-powered assistance, easy appointments
            and secure medical records.
          </p>

          <div className="feature-list">

            <div>
              <ShieldCheck />
              <span>Secure Patient Information</span>
            </div>

            <div>
              <Calendar />
              <span>Easy Appointment Management</span>
            </div>

            <div>
              <HeartPulse />
              <span>AI-Powered Healthcare Assistance</span>
            </div>

          </div>

        </div>

        <p className="left-footer">
          © 2026 CareAI Healthcare. All rights reserved.
        </p>

      </div>

      {/* RIGHT SECTION */}

      <div className="register-right">

        <div className="register-card">

          <div className="mobile-brand">
            <HeartPulse size={25} />
            <span>CareAI</span>
          </div>

          <div className="form-heading">

            <span className="heading-tag">
              CREATE ACCOUNT
            </span>

            <h2>Join CareAI Today</h2>

            <p>
              Enter your details to create your account.
            </p>

          </div>

          {/* ROLE SELECTION */}

          <div className="role-section">

            <label>I want to register as</label>

            <div className="role-options">

              <button
                type="button"
                className={`role-card ${
                  role === "PATIENT" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("PATIENT")}
              >

                <UserRound size={23} />

                <span>Patient</span>

                <small>
                  Access healthcare services
                </small>

              </button>

              <button
                type="button"
                className={`role-card ${
                  role === "DOCTOR" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("DOCTOR")}
              >

                <Stethoscope size={23} />

                <span>Doctor</span>

                <small>
                  Manage your patients
                </small>

              </button>

            </div>

          </div>

          {/* REGISTRATION FORM */}

          <form onSubmit={handleSubmit}>

            <h3 className="section-title">

              {role === "PATIENT"
                ? "Personal Information"
                : "Doctor Information"}

            </h3>

            <div className="form-grid">

              {/* COMMON FIELDS */}

              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                icon={UserRound}
                value={form.fullName}
                onChange={handleChange}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                icon={Mail}
                value={form.email}
                onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                icon={Phone}
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
              />

              {/* PATIENT FIELDS */}

              {role === "PATIENT" ? (

                <>

                  <InputField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    icon={Calendar}
                    value={form.dob}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    options={["Male", "Female", "Other"]}
                    value={form.gender}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Blood Group"
                    name="bloodGroup"
                    options={[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "O+",
                      "O-",
                      "AB+",
                      "AB-"
                    ]}
                    value={form.bloodGroup}
                    onChange={handleChange}
                  />

                  <div className="form-group full-width">

                    <label htmlFor="address">
                      Address
                    </label>

                    <div className="input-wrapper">

                      <MapPin
                        size={18}
                        className="input-icon"
                      />

                      <input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Enter your address"
                        value={form.address}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </>

              ) : (

                /* DOCTOR FIELDS */

                <>

                  <InputField
                    label="Specialization"
                    name="specialization"
                    placeholder="e.g. Cardiologist"
                    icon={Stethoscope}
                    value={form.specialization}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Qualification"
                    name="qualification"
                    placeholder="e.g. MBBS, MD"
                    value={form.qualification}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Medical License Number"
                    name="licenseNumber"
                    placeholder="Enter license number"
                    value={form.licenseNumber}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    placeholder="e.g. 5"
                    min="0"
                    value={form.experience}
                    onChange={handleChange}
                  />

                  <InputField
                    label="Consultation Fee (₹)"
                    name="consultationFee"
                    type="number"
                    placeholder="e.g. 500"
                    min="0"
                    value={form.consultationFee}
                    onChange={handleChange}
                  />

                </>

              )}

            </div>

            {/* ACCOUNT SECURITY */}

            <h3 className="section-title security-title">
              Account Security
            </h3>

            <div className="form-grid">

              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <Lock
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label="Toggle password visibility"
                  >

                    {showPassword ? <EyeOff /> : <Eye />}

                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="input-wrapper">

                  <Lock
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirm((prev) => !prev)
                    }
                    aria-label="Toggle confirm password visibility"
                  >

                    {showConfirm ? <EyeOff /> : <Eye />}

                  </button>

                </div>

              </div>

            </div>

            {/* TERMS AND CONDITIONS */}

            <div className="terms-row">

              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the Terms & Conditions and Privacy Policy.
              </label>

            </div>

            {/* ERROR MESSAGE */}

            {error && (

              <div className="message error">
                {error}
              </div>

            )}

            {/* SUCCESS MESSAGE */}

            {success && (

              <div className="message success">
                {success}
              </div>

            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight size={19} />}

            </button>

          </form>

          {/* LOGIN LINK */}

          <p className="login-link">

            Already have an account?{" "}

            <Link to="/login">
              Sign In
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;
