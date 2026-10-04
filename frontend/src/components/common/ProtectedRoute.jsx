import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LOGIN_PATH = {
  STUDENT: "/student/login",
  ADMIN: "/admin/login",
};

const HOME_PATH = {
  STUDENT: "/student/dashboard",
  ADMIN: "/admin/dashboard",
};

/**
 * Guards a group of routes.
 * - Not signed in            -> the matching login page
 * - Signed in with wrong role -> that user's own dashboard
 */
export default function ProtectedRoute({ role = "STUDENT" }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="route-loading">Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to={LOGIN_PATH[role]}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (user.role !== role) {
    return <Navigate to={HOME_PATH[user.role] || "/"} replace />;
  }

  return <Outlet />;
}
