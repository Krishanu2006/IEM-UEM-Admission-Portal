import api from "./api";

export const getStudentDocuments = async () => {
  const response = await api.get("/student/documents");
  return response.data;
};

export const uploadStudentDocument = async ({ documentType, file }) => {
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("document", file);

  const response = await api.post("/student/documents", formData);
  return response.data;
};

export const deleteStudentDocument = async (documentId) => {
  const response = await api.delete(`/student/documents/${documentId}`);
  return response.data;
};

export const getAdminDocumentFile = async (documentId) => {
  const response = await api.get(
    `/admin/documents/${documentId}/file`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};