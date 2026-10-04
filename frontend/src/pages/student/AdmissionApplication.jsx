import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/layout/StudentLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import { COURSES, getCourseName } from "../../constants/courses";
import { getStudentProfile } from "../../services/student.api";
import {
  createApplication,
  fetchStudentApplicationOrNull,
  submitStudentApplication,
  updateStudentApplication,
} from "../../services/application.api";

const emptyForm = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  category: "",
  email: "",
  phone: "",
  address: "",
  class10Board: "",
  class10Percentage: "",
  class12Board: "",
  class12Percentage: "",
  course: "",
};

const fromApplication = (app, profile) => ({
  fullName: app?.personalDetails?.fullName || (profile ? `${profile.fname} ${profile.lname}` : ""),
  dateOfBirth: app?.personalDetails?.dateOfBirth || "",
  gender: app?.personalDetails?.gender || "",
  category: app?.personalDetails?.category || "",
  email: app?.contactDetails?.email || profile?.email || "",
  phone: app?.contactDetails?.phone || profile?.mobile || "",
  address: app?.contactDetails?.address || "",
  class10Board: app?.academicDetails?.class10?.board || "",
  class10Percentage: app?.academicDetails?.class10?.percentage ?? "",
  class12Board: app?.academicDetails?.class12?.board || "",
  class12Percentage: app?.academicDetails?.class12?.percentage ?? "",
  course: getCourseName(app?.coursePreferences?.[0]?.courseId) || "",
});

const toPayload = (f) => ({
  personalDetails: {
    fullName: f.fullName.trim(),
    dateOfBirth: f.dateOfBirth,
    gender: f.gender,
    category: f.category,
  },
  contactDetails: {
    email: f.email.trim(),
    phone: f.phone.trim(),
    address: f.address.trim(),
  },
  academicDetails: {
    class10: {
      board: f.class10Board.trim(),
      percentage: f.class10Percentage === "" ? undefined : Number(f.class10Percentage),
    },
    class12: {
      board: f.class12Board.trim(),
      percentage: f.class12Percentage === "" ? undefined : Number(f.class12Percentage),
    },
  },
  coursePreferences: f.course
    ? [{ courseId: COURSES.find((c) => c.name === f.course)?.id, preference: 1 }]
    : [],
});

export default function AdmissionApplication() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const profileResponse = await getStudentProfile();
        // null = "No application yet" (404); the form simply starts empty.
        const app = await fetchStudentApplicationOrNull();
        setApplication(app);
        setForm(fromApplication(app, profileResponse.data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const locked = !!application && application.status !== "DRAFT";

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Creates the draft on first save (the backend call is idempotent), then saves.
  const saveDraft = async () => {
    if (!application) {
      const created = await createApplication();
      setApplication(created.data);
    }
    const response = await updateStudentApplication(toPayload(form));
    setApplication(response.data);
    return response;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await saveDraft();
      setMessage("Draft saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!window.confirm("Submit your application? You will not be able to edit it afterwards.")) {
      return;
    }

    const required = ["fullName", "dateOfBirth", "gender", "category", "email", "phone", "address", "class10Board", "class10Percentage", "class12Board", "class12Percentage", "course"];
    if (required.some((k) => String(form[k]).trim() === "")) {
      setError("Please complete every field before submitting.");
      return;
    }

    setBusy(true);
    try {
      await saveDraft();
      await submitStudentApplication();
      navigate("/student/application/view");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <section className="content"><p>Loading application...</p></section>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <section className="content">
        <PageHeader
          eyebrow="ADMISSION APPLICATION"
          title="Complete your application"
          description="Enter the personal, contact, academic and course information required for admission."
          action={application && <StatusBadge status={application.status} />}
        />
        {error && <div className="form-error">{error}</div>}
        {locked && <div className="form-success">This application has been submitted and can no longer be edited.</div>}

        <form className="stack-lg" onSubmit={handleSave}>
          <fieldset disabled={locked || busy} style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: "inherit" }}>
            <div className="card">
              <div className="section-title"><span>01</span><div><h2>Personal details</h2><p>Information used to identify the applicant.</p></div></div>
              <div className="form-grid">
                <TextField label="Full name" value={form.fullName} onChange={change("fullName")} required />
                <TextField label="Date of birth" type="date" value={form.dateOfBirth} onChange={change("dateOfBirth")} required />
                <SelectField label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={change("gender")} required />
                <SelectField label="Category" options={["General", "OBC", "SC", "ST", "EWS"]} value={form.category} onChange={change("category")} required />
              </div>
            </div>

            <div className="card">
              <div className="section-title"><span>02</span><div><h2>Contact details</h2><p>Provide your current contact information.</p></div></div>
              <div className="form-grid">
                <TextField label="Mobile number" value={form.phone} onChange={change("phone")} required />
                <TextField label="Email address" type="email" value={form.email} onChange={change("email")} required />
                <label className="field full"><span>Address<b>*</b></span><textarea rows="4" placeholder="Enter your full address" value={form.address} onChange={change("address")} required /></label>
              </div>
            </div>

            <div className="card">
              <div className="section-title"><span>03</span><div><h2>Academic details</h2><p>Enter your Class 10 and Class 12 information.</p></div></div>
              <div className="form-grid">
                <TextField label="Class 10 board" placeholder="e.g. CBSE" value={form.class10Board} onChange={change("class10Board")} required />
                <TextField label="Class 10 percentage" type="number" min="0" max="100" step="0.01" value={form.class10Percentage} onChange={change("class10Percentage")} required />
                <TextField label="Class 12 board" placeholder="e.g. WBCHSE" value={form.class12Board} onChange={change("class12Board")} required />
                <TextField label="Class 12 percentage" type="number" min="0" max="100" step="0.01" value={form.class12Percentage} onChange={change("class12Percentage")} required />
              </div>
            </div>

            <div className="card">
              <div className="section-title"><span>04</span><div><h2>Course selection</h2><p>Select the programme you are applying for.</p></div></div>
              <SelectField label="Course / Programme" options={COURSES.map((c) => c.name)} value={form.course} onChange={change("course")} required />
            </div>
          </fieldset>

          <div className="form-actions">
            {message && <span className="save-message">{message}</span>}
            {!locked && (
              <>
                <button type="submit" className="button button-secondary" disabled={busy}>
                  {busy ? "Working..." : "Save draft"}
                </button>
                <button type="button" className="button button-primary" onClick={handleSubmit} disabled={busy}>
                  Submit application
                </button>
              </>
            )}
            {locked && (
              <button type="button" className="button button-primary" onClick={() => navigate("/student/application/view")}>
                View submitted application
              </button>
            )}
          </div>
        </form>
      </section>
    </StudentLayout>
  );
}
