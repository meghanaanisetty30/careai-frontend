
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Call Spring Boot login API
      const response = await loginUser({
        email: normalizedEmail,
        password: password
      });

      // Get data returned by backend
      const { token, email: userEmail, role } = response.data;

      if (!token || !role) {
        throw new Error("Invalid response received from server.");
      }

      // Normalize role
      const normalizedRole = role.replace("ROLE_", "").toUpperCase();

      if (
        normalizedRole !== "PATIENT" &&
        normalizedRole !== "DOCTOR"
      ) {
        throw new Error("Invalid user role.");
      }

      // Store actual JWT token
      localStorage.setItem("token", token);
      localStorage.setItem("role", normalizedRole);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: userEmail,
          role: normalizedRole
        })
      );

      // Navigate according to role
      if (normalizedRole === "PATIENT") {
        navigate("/patient/dashboard", { replace: true });
      } else {
        navigate("/doctor/dashboard", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);

      const errorMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : err.message) ||
        "Invalid email or password.";

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">
          <h1>CareAI</h1>
          <p>Your Smart Healthcare Companion</p>
        </div>

        <div className="login-welcome">
          <h2>Healthcare made smarter.</h2>

          <p>
            Access your healthcare services, manage appointments,
            and get intelligent health assistance in one place.
          </p>
        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="login-heading">
            <h2>Welcome Back!</h2>
            <p>Login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="register-link">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
