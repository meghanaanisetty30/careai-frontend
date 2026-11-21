
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  ClipboardList,
  MessageCircle,
  HeartPulse,
  X
} from "lucide-react";

function Sidebar({ role, isOpen, onClose }) {
  const patientMenu = [
    {
      name: "Dashboard",
      path: "/patient/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Appointments",
      path: "/patient/appointments",
      icon: CalendarDays
    },
    {
      name: "Medical History",
      path: "/patient/medical-history",
      icon: ClipboardList
    },
    {
      name: "Medical Reports",
      path: "/patient/medical-reports",
      icon: FileText
    },
    {
      name: "AI Health Assistant",
      path: "/patient/ai-assistant",
      icon: MessageCircle
    }
  ];

  const doctorMenu = [
    {
      name: "Dashboard",
      path: "/doctor/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarDays
    },
    {
      name: "Patients",
      path: "/doctor/patients",
      icon: HeartPulse
    },
    {
      name: "Medical Reports",
      path: "/doctor/medical-reports",
      icon: FileText
    }
  ];

  const menuItems = role === "DOCTOR" ? doctorMenu : patientMenu;

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <HeartPulse size={28} />
            <span>CareAI</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-icon">
            <HeartPulse size={22} />
          </div>

          <div>
            <h4>{role === "DOCTOR" ? "Doctor Portal" : "Patient Portal"}</h4>
            <p>{role}</p>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <p className="sidebar-label">MAIN MENU</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>CareAI Healthcare System</p>
          <span>Smart Healthcare Assistance</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
