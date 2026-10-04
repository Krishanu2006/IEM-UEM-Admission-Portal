import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleAlert, FileText, Upload, UserRound } from "lucide-react";
import StudentLayout from "../../components/layout/StudentLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { useEffect, useState } from "react";
import { getStudentProfile } from "../../services/student.api";
import { fetchStudentApplicationOrNull } from "../../services/application.api";
import { getStudentDocuments } from "../../services/document.api";
import { getCourseName } from "../../constants/courses";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileResponse = await getStudentProfile();
        setProfile(profileResponse.data);

        // 404 from GET /student/application means "No application yet".
        const app = await fetchStudentApplicationOrNull();
        setApplication(app);

        if (app) {
          const documentsResponse = await getStudentDocuments();
          setDocumentCount(documentsResponse.data?.length || 0);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <section className="content">
          <p>Loading dashboard...</p>
        </section>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <section className="content">
          <div className="card">
            <strong>{error}</strong>
          </div>
        </section>
      </StudentLayout>
    );
  }

  const fullName = profile
    ? `${profile.fname} ${profile.lname}`
    : "Student";

  const hasDetails = !!(
    application?.personalDetails?.fullName &&
    application?.academicDetails?.class12?.board
  );
  const hasCourse = !!application?.coursePreferences?.length;
  const isSubmitted = !!application && application.status !== "DRAFT";

  const course =
    getCourseName(application?.coursePreferences?.[0]?.courseId) ||
    "Course not selected";

  const checklist = [
    ["Account created", true],
    ["Personal & academic details", hasDetails && hasCourse],
    ["Documents uploaded", documentCount > 0],
    ["Application submitted", isSubmitted],
    ["Admission decision", application?.status === "APPROVED" || application?.status === "REJECTED"],
  ];

  const progress = application
    ? Math.round((checklist.filter(([, done]) => done).length / checklist.length) * 100)
    : 0;

  return (
    <StudentLayout>
      <div className="topbar">
        <div>
          <span className="topbar-label">STUDENT PORTAL</span>
          <strong>{fullName}</strong>
        </div>

        <span className="avatar">
          {profile?.fname?.[0] || "S"}
          {profile?.lname?.[0] || ""}
        </span>
      </div>

      <section className="content">
        <div className="page-header">
          <div>
            <div className="eyebrow">ADMISSION 2026</div>
            <h1>Your admission dashboard</h1>
            <p>
              Complete the remaining steps to keep your application
              ready for review.
            </p>
          </div>

          {application && <StatusBadge status={application.status} />}
        </div>

        <div className="dashboard-grid">
          <div className="card application-card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">APPLICATION</span>
                <h2>
                  {application
                    ? application.applicationId
                    : "No application yet"}
                </h2>
              </div>

              {application && (
                <StatusBadge status={application.status} />
              )}
            </div>

            <p className="muted">
              {application
                ? course
                : "Start your admission application to continue."}
            </p>
            <div className="progress-track">
              <div
                className="progress-value"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-meta">
              <span>Application progress</span>
              <strong>{progress}%</strong>
            </div>
            {!application && (
              <Link to="/student/application" className="text-link">
                Start application
                <ArrowRight size={16} />
              </Link>
            )}
            {isSubmitted && (
              <Link
                to="/student/application/view"
                className="text-link"
              >
                View submitted application
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          <div className="card">
            <div className="card-heading">
              <h2>Application checklist</h2>
            </div>

            <div className="checklist">
              {checklist.map(([label, done]) => (
                <div className="check-row" key={label}>
                  {done ? (
                    <CheckCircle2
                      className="success-icon"
                      size={19}
                    />
                  ) : (
                    <CircleAlert
                      className="pending-icon"
                      size={19}
                    />
                  )}

                  <span>{label}</span>
                  <small>{done ? "Done" : "Pending"}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-grid">
          <Link
            to="/student/profile"
            className="quick-card"
          >
            <UserRound />

            <div>
              <strong>Personal details</strong>
              <span>Review your information</span>
            </div>

            <ArrowRight />
          </Link>

          <Link
            to="/student/documents"
            className="quick-card"
          >
            <Upload />

            <div>
              <strong>Documents</strong>
              <span>View uploaded files</span>
            </div>

            <ArrowRight />
          </Link>

          <Link
            to="/student/status"
            className="quick-card"
          >
            <FileText />

            <div>
              <strong>Application status</strong>
              <span>Track your application</span>
            </div>

            <ArrowRight />
          </Link>
        </div>
      </section>
    </StudentLayout>
  );
}