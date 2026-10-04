import api from "./api";

export const getAdminApplications = async () => {
  const response = await api.get("/admin/applications");
  return response.data;
};

export const getAdminApplication = async (applicationId) => {
  const response = await api.get(`/admin/applications/${applicationId}`);
  return response.data;
};

export const updateAdminApplicationStatus = async (
  applicationId,
  { status, rejectionReason }
) => {
  const response = await api.put(
    `/admin/applications/${applicationId}/status`,
    { status, rejectionReason }
  );
  return response.data;
};

export const getAdminDocuments = async () => {
  const response = await api.get("/admin/documents");
  return response.data;
};
