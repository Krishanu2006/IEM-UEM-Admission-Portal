import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAdminDocumentFile,
} from "../../services/document.api";
import {
  getAdminApplication,
  getAdminDocuments,
  updateAdminApplicationStatus,
} from "../../services/admin.api";
import { applicantCourse, applicantName } from "../../utils";

const DOC_LABELS = {
  PHOTO: "Photograph",
  SIGNATURE: "Signature",
  AADHAAR: "Aadhaar",
  CLASS_10_MARKSHEET: "Class 10 Marksheet",
  CLASS_12_MARKSHEET: "Class 12 Marksheet",
  OTHER: "Other",
};

const show = (v) => (v === undefined || v === null || v === "" ? "—" : v);

export default function AdminApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const handleViewDocument = async (documentId) => {
    try {
      const blob = await getAdminDocumentFile(documentId);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error(
        "Failed to open document:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to open document"
      );
    }
  };
  useEffect(() => {

    const load = async () => {
      try {
        const [appResponse, docsResponse] = await Promise.all([
          getAdminApplication(id),
          getAdminDocuments(),
        ]);
        setApplication(appResponse.data);
        setDocuments((docsResponse.data || []).filter((d) => d.applicationId === id));
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Application not found"
            : err.response?.data?.message || "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const save = async () => {
    setError("");
    setMessage("");

    if (!decision) {
      setError("Choose a status first.");
      return;
    }
    if (decision === "REJECTED" && !reason.trim()) {
      setError("A reason is required to reject an application.");
      return;
    }

    setSaving(true);
    try {
      const response = await updateAdminApplicationStatus(id, {
        status: decision,
        rejectionReason: decision === "REJECTED" ? reason.trim() : undefined,
      });
      setApplication(response.data);
      setDecision("");
      setMessage("Status updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><section className="content"><p>Loading application...</p></section></AdminLayout>;
  }

  if (!application) {
    return (
      <AdminLayout>
        <section className="content">
          <Link to="/admin/applications" className="back-link"><ArrowLeft size={16} /> Back to applications</Link>
          <div className="form-error">{error || "Application not found"}</div>
        </section>
      </AdminLayout>
    );
  }

  const a = application;
  const finalized = a.status === "APPROVED" || a.status === "REJECTED";
  const canReview = a.status === "SUBMITTED";

  return (
    <AdminLayout>
      <section className="content">
        <Link to="/admin/applications" className="back-link"><ArrowLeft size={16} /> Back to applications</Link>
        <div className="page-header">
          <div><div className="eyebrow">APPLICATION REVIEW</div><h1>{a.applicationId}</h1><p>{applicantName(a)} · {applicantCourse(a)}</p></div>
          <StatusBadge status={a.status} />
        </div>

        <div className="admin-review-grid">
          <div className="stack-lg">
            <InfoSection title="Applicant details" items={[
              ["Full name", a.personalDetails?.fullName], ["Date of birth", a.personalDetails?.dateOfBirth],
              ["Email", a.contactDetails?.email], ["Mobile", a.contactDetails?.phone],
              ["Gender", a.personalDetails?.gender], ["Category", a.personalDetails?.category],
              ["Address", a.contactDetails?.address],
            ]} />
            <InfoSection title="Academic details" items={[
              ["Class 10 board", a.academicDetails?.class10?.board], ["Class 10 %", a.academicDetails?.class10?.percentage],
              ["Class 12 board", a.academicDetails?.class12?.board], ["Class 12 %", a.academicDetails?.class12?.percentage],
              ["Course", applicantCourse(a)],
            ]} />
            <div className="card">
              <div className="card-heading"><h2>Submitted documents</h2><span className="muted">{documents.length} files</span></div>
              {documents.length === 0 ? (
                <div className="empty-state">No documents uploaded.</div>
              ) : (
                <div className="document-list">
                  {documents.map((doc) => (
                    <div className="document-row" key={doc._id}>
                      <div className="file-icon">
                        <FileText size={19} />
                      </div>

                      <div className="document-info">
                        <strong>
                          {DOC_LABELS[doc.documentType] || doc.documentType}
                        </strong>

                        <span>
                          {doc.fileName} · {doc.verificationStatus}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleViewDocument(doc._id)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="card review-panel">
            <span className="eyebrow">DECISION</span>
            <h2>Update application status</h2>
            {finalized ? (
              <p className="muted">
                This application has been {a.status.toLowerCase()} and can no longer be modified.
                {a.status === "REJECTED" && a.rejectionReason ? ` Reason: ${a.rejectionReason}` : ""}
              </p>
            ) : (
              <>
                <p className="muted">Record the administrative decision for this application.</p>
                {error && <div className="form-error">{error}</div>}
                {message && <div className="form-success">{message}</div>}
                <div className="decision-buttons">
                  {canReview && (
                    <button type="button" className={decision === "UNDER_REVIEW" ? "decision active" : "decision"} onClick={() => setDecision("UNDER_REVIEW")}><Clock3 size={19} /> Start review</button>
                  )}
                  <button type="button" className={decision === "APPROVED" ? "decision active approved" : "decision"} onClick={() => setDecision("APPROVED")}><CheckCircle2 size={19} /> Approve</button>
                  <button type="button" className={decision === "REJECTED" ? "decision active rejected" : "decision"} onClick={() => setDecision("REJECTED")}><XCircle size={19} /> Reject</button>
                </div>
                {decision === "REJECTED" && <label className="field"><span>Reason for rejection<b>*</b></span><textarea rows="5" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide the reason for rejection..." /></label>}
                <button type="button" className="button button-primary button-full" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save status"}</button>
              </>
            )}
            {finalized && error && <div className="form-error">{error}</div>}
          </aside>
        </div>
      </section>
    </AdminLayout>
  );
}

function InfoSection({ title, items }) {
  return <div className="card info-card"><h2>{title}</h2><div className="info-list two-col">{items.map(([l, v]) => <div key={l}><span>{l}</span><strong>{show(v)}</strong></div>)}</div></div>;
}
