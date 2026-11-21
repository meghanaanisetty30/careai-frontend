import { Menu, Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick, role }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName =
    user.name || user.fullName || (role === "DOCTOR" ? "Doctor" : "Patient");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div>
          <h3>Welcome, {userName}</h3>
          <p>{role === "DOCTOR" ? "Doctor Portal" : "Patient Portal"}</p>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon" aria-label="Notifications">
          <Bell size={21} />
        </button>

        <div className="navbar-profile">
          <UserCircle size={32} />
          <div>
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;