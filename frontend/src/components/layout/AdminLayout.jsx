import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Files, LogOut } from "lucide-react";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar admin-sidebar">
        <Logo />
        <div className="sidebar-section-label">Administration</div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <Files size={18} />
            <span>Applications</span>
          </NavLink>
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
