import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserRound, FileText, Upload, ClipboardCheck, LogOut } from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/profile", label: "Personal Details", icon: UserRound },
  { to: "/student/application", label: "Admission Application", icon: FileText },
  { to: "/student/documents", label: "Documents", icon: Upload },
  { to: "/student/status", label: "Application Status", icon: ClipboardCheck }
];

export default function StudentLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/student/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <div className="sidebar-section-label">Student Portal</div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button type="button" className="sidebar-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
