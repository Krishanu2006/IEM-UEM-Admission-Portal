// The backend has no course-catalogue API yet (Application.coursePreferences
// stores only courseId + preference). Until one exists, the selectable
// courses live here and are the single source for the form and the displays.
export const COURSES = [
  { id: 1, name: "B.Tech Computer Science & Engineering" },
  { id: 2, name: "B.Tech Information Technology" },
  { id: 3, name: "B.Tech Electronics & Communication Engineering" },
  { id: 4, name: "B.Tech Electrical Engineering" },
];

export const getCourseName = (courseId) =>
  COURSES.find((c) => c.id === courseId)?.name || null;
