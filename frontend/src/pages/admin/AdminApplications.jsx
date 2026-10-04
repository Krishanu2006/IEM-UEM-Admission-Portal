import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getAdminApplications } from "../../services/admin.api";
import { applicantCourse, applicantName, formatDate } from "../../utils";

export default function AdminApplications() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminApplications();
        setAll((response.data || []).filter((a) => a.status !== "DRAFT"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const applications = useMemo(() => all.filter((a) =>
    (!query || `${a.applicationId} ${applicantName(a)} ${applicantCourse(a)}`.toLowerCase().includes(query.toLowerCase())) &&
    (!status || a.status === status)
  ), [all, query, status]);

  return (
    <AdminLayout>
      <section className="content">
        <PageHeader eyebrow="APPLICATION MANAGEMENT" title="Applications" description="Search, filter and open submitted admission applications." />
        {error && <div className="form-error">{error}</div>}
        <div className="card filter-bar">
          <div className="search-field"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by ID, student or course..." /></div>
          <div className="select-with-icon"><SlidersHorizontal size={17} /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="SUBMITTED">Submitted</option><option value="UNDER_REVIEW">Under Review</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></div>
        </div>
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Application ID</th><th>Student</th><th>Course</th><th>Updated</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {applications.map((a) => <tr key={a.applicationId}><td><strong>{a.applicationId}</strong></td><td>{applicantName(a)}</td><td>{applicantCourse(a)}</td><td>{formatDate(a.updatedAt)}</td><td><StatusBadge status={a.status} /></td><td><Link to={`/admin/applications/${a.applicationId}`} className="table-link">View</Link></td></tr>)}
              </tbody>
            </table>
          </div>
          {loading && <div className="empty-state">Loading applications...</div>}
          {!loading && !applications.length && <div className="empty-state">No applications match your filters.</div>}
        </div>
      </section>
    </AdminLayout>
  );
}
