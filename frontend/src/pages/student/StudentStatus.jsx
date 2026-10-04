import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import StudentLayout from "../../components/layout/StudentLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getStudentStatus } from "../../services/student.api";

export default function StudentStatus() {
  const [data, setData] = useState(null);
  const [noApplication, setNoApplication] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getStudentStatus();
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNoApplication(true); // "No application yet"
        } else {
          setError(err.response?.data?.message || "Failed to load status");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <StudentLayout><section className="content"><p>Loading status...</p></section></StudentLayout>;
  }

  if (error) {
    return <StudentLayout><section className="content"><div className="form-error">{error}</div></section></StudentLayout>;
  }

  if (noApplication) {
    return (
      <StudentLayout>
        <section className="content">
          <PageHeader eyebrow="APPLICATION STATUS" title="No application yet" description="Start your admission application to begin tracking its status." />
          <Link to="/student/application" className="button button-primary">Start application</Link>
        </section>
      </StudentLayout>
    );
  }

  const status = data.status;
  const submitted = status !== "DRAFT";
  const reviewed = ["UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status);
  const decided = status === "APPROVED" || status === "REJECTED";

  const steps = [
    ["Application submitted", submitted ? `Last updated ${new Date(data.submittedAt).toLocaleString()}` : "Your application is still a draft.", submitted],
    ["Under review", reviewed ? "Application is being reviewed by the admissions team." : "Waiting for the admissions team.", reviewed],
    [
      "Admission decision",
      status === "APPROVED" ? "Your application has been approved." :
      status === "REJECTED" ? `Your application was rejected.${data.rejectionReason ? ` Reason: ${data.rejectionReason}` : ""}` :
      "Pending administrative decision.",
      decided,
    ],
  ];

  return (
    <StudentLayout>
      <section className="content">
        <PageHeader eyebrow="APPLICATION STATUS" title="Track your application" description={`Application ID: ${data.applicationId}`} action={<StatusBadge status={status} />} />
        <div className="card status-card">
          {steps.map(([title, detail, done], index) => (
            <div className="timeline-row" key={title}>
              <div className={`timeline-icon ${done ? "done" : ""}`}>
                {done
                  ? (status === "REJECTED" && index === 2 ? <XCircle size={20} /> : <CheckCircle2 size={20} />)
                  : <Clock3 size={20} />}
              </div>
              <div className="timeline-content">
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card info-callout">
          <strong>What happens next?</strong>
          <p>The admissions team will review your application and documents. If a decision is recorded, the status shown here will be updated.</p>
        </div>
      </section>
    </StudentLayout>
  );
}
