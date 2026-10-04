import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/layout/StudentLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { getCourseName } from "../../constants/courses";
import { fetchStudentApplicationOrNull } from "../../services/application.api";

const show = (v) => (v === undefined || v === null || v === "" ? "—" : v);

export default function SubmittedApplication() {
  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setA(await fetchStudentApplicationOrNull());
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <StudentLayout><section className="content"><p>Loading application...</p></section></StudentLayout>;
  }

  if (error) {
    return <StudentLayout><section className="content"><div className="form-error">{error}</div></section></StudentLayout>;
  }

  if (!a || a.status === "DRAFT") {
    return (
      <StudentLayout>
        <section className="content">
          <PageHeader eyebrow="SUBMITTED APPLICATION" title={a ? "Not submitted yet" : "No application yet"} description="There is no submitted application to show." />
          <Link to="/student/application" className="button button-primary">{a ? "Continue application" : "Start application"}</Link>
        </section>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <section className="content">
        <PageHeader eyebrow="SUBMITTED APPLICATION" title={a.applicationId} description={`Last updated ${new Date(a.updatedAt).toLocaleString()}`} action={<StatusBadge status={a.status} />} />
        <div className="summary-grid">
          <Info title="Personal details" items={[
            ["Full name", a.personalDetails?.fullName], ["Date of birth", a.personalDetails?.dateOfBirth],
            ["Gender", a.personalDetails?.gender], ["Category", a.personalDetails?.category],
          ]} />
          <Info title="Contact details" items={[
            ["Email", a.contactDetails?.email], ["Mobile", a.contactDetails?.phone], ["Address", a.contactDetails?.address],
          ]} />
          <Info title="Academic details" items={[
            ["Class 10 board", a.academicDetails?.class10?.board], ["Class 10 %", a.academicDetails?.class10?.percentage],
            ["Class 12 board", a.academicDetails?.class12?.board], ["Class 12 %", a.academicDetails?.class12?.percentage],
          ]} />
          <Info title="Course" items={[
            ["Course", getCourseName(a.coursePreferences?.[0]?.courseId)],
          ]} />
        </div>
      </section>
    </StudentLayout>
  );
}

function Info({ title, items }) {
  return (
    <div className="card info-card">
      <h2>{title}</h2>
      <div className="info-list">
        {items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{show(value)}</strong></div>)}
      </div>
    </div>
  );
}
