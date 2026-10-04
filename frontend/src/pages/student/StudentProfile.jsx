import { useEffect, useState } from "react";
import StudentLayout from "../../components/layout/StudentLayout";
import PageHeader from "../../components/common/PageHeader";
import TextField from "../../components/forms/TextField";
import { getStudentProfile, updateStudentProfile } from "../../services/student.api";

export default function StudentProfile() {
  const [form, setForm] = useState({ fname: "", lname: "", mobile: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getStudentProfile();
        const p = response.data;
        setForm({ fname: p.fname || "", lname: p.lname || "", mobile: p.mobile || "" });
        setEmail(p.email || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await updateStudentProfile(form);
      setSuccess(response.message || "Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudentLayout>
      <section className="content">
        <PageHeader eyebrow="STUDENT PROFILE" title="Personal details" description="View and update the personal information associated with your account." />
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <form className="card form-grid" onSubmit={submit}>
            <TextField label="First name" value={form.fname} onChange={change("fname")} required />
            <TextField label="Last name" value={form.lname} onChange={change("lname")} required />
            <TextField label="Email address" type="email" value={email} readOnly disabled />
            <TextField label="Mobile number" value={form.mobile} onChange={change("mobile")} required />
            <div className="form-actions full">
              <button className="button button-primary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </StudentLayout>
  );
}
