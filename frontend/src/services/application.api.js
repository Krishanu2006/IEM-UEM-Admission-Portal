import api from "./api";

export const createApplication = async () => {
  const response = await api.post("/student/application");
  return response.data;
};

export const getStudentApplication = async () => {
  const response = await api.get("/student/application");
  return response.data;
};

export const updateStudentApplication = async (data) => {
  const response = await api.put("/student/application", data);
  return response.data;
};

export const submitStudentApplication = async () => {
  const response = await api.post("/student/application/submit");
  return response.data;
};

// Returns the application, or null when the student has not created one yet.
// The backend answers GET /student/application with 404 in that case, which is
// a normal state ("No application yet") and not an error.
export const fetchStudentApplicationOrNull = async () => {
  try {
    const response = await getStudentApplication();
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
