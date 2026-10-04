import api from "./api";

export const getStudentProfile = async () => {
  const response = await api.get("/student/profile");
  return response.data;
};

export const updateStudentProfile = async (data) => {
  const response = await api.put("/student/profile", data);
  return response.data;
};

export const getStudentStatus = async () => {
  const response = await api.get("/student/status");
  return response.data;
};