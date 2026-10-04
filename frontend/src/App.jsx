import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import AdmissionApplication from "./pages/student/AdmissionApplication";
import StudentDocuments from "./pages/student/StudentDocuments";
import StudentStatus from "./pages/student/StudentStatus";
import SubmittedApplication from "./pages/student/SubmittedApplication";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplicationDetails from "./pages/admin/AdminApplicationDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/application" element={<AdmissionApplication />} />
        <Route path="/student/documents" element={<StudentDocuments />} />
        <Route path="/student/status" element={<StudentStatus />} />
        <Route
          path="/student/application/view"
          element={<SubmittedApplication />}
        />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/applications/:id" element={<AdminApplicationDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}