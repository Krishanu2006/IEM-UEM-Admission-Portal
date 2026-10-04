import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import StatusBadge from "../../components/common/StatusBadge";
import { getAdminApplications } from "../../services/admin.api";
import { applicantCourse, applicantName } from "../../utils";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminApplications();
        // Drafts are not yet submitted for review.
        setApplications((response.data || []).filter((a) => a.status !== "DRAFT"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const count = (...statuses) => applications.filter((a) => statuses.includes(a.status)).length;
  const attention = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW"].includes(a.status)).slice(0, 5);

  return (
    <AdminLayout>
      <section className="content">
        <div className="topbar"><div><span className="topbar-label">ADMINISTRATION</span><strong>Admission Management</strong></div><span className="avatar admin-avatar">AD</span></div>
        <div className="page-header">
          <div><div className="eyebrow">OVERVIEW</div><h1>Admission dashboard</h1><p>Monitor and process submitted applications.</p></div>
          <Link to="/admin/applications" className="button button-primary">View applications <ArrowRight size={17} /></Link>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="stats-grid">
          <Stat icon={FileText} label="Total applications" value={loading ? "…" : applications.length} />
          <Stat icon={Clock3} label="Pending review" value={loading ? "…" : count("SUBMITTED", "UNDER_REVIEW")} />
          <Stat icon={CheckCircle2} label="Approved" value={loading ? "…" : count("APPROVED")} />
          <Stat icon={XCircle} label="Rejected" value={loading ? "…" : count("REJECTED")} />
        </div>

        <div className="card">
          <div className="card-heading"><div><span className="eyebrow">RECENT</span><h2>Applications requiring attention</h2></div><Link to="/admin/applications" className="text-link">View all <ArrowRight size={15} /></Link></div>
          {!loading && attention.length === 0 ? (
            <div className="empty-state">No applications are waiting for review.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Application ID</th><th>Student</th><th>Course</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {attention.map((a) => (
                    <tr key={a.applicationId}><td><strong>{a.applicationId}</strong></td><td>{applicantName(a)}</td><td>{applicantCourse(a)}</td><td><StatusBadge status={a.status} /></td><td><Link to={`/admin/applications/${a.applicationId}`} className="table-link">Open</Link></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

function Stat({ icon: Icon, label, value }) {
  return <div className="card stat-card"><div className="stat-icon"><Icon size={20} /></div><span>{label}</span><strong>{value}</strong></div>;
}
