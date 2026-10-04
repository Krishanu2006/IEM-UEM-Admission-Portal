const LABELS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function StatusBadge({ status }) {
  const key = String(status || "DRAFT").toUpperCase().replace(/\s+/g, "_");
  const label = LABELS[key] || String(status);
  const cls = key.toLowerCase().replace(/_/g, "-");
  return <span className={`status-badge ${cls}`}>{label}</span>;
}
