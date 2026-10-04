import { getCourseName } from "./constants/courses";

export const applicantName = (app) =>
  app.personalDetails?.fullName || `Applicant #${app.userId}`;

export const applicantCourse = (app) =>
  getCourseName(app.coursePreferences?.[0]?.courseId) || "—";

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
