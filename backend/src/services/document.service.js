const Document = require("../models/mongodb/Document");
const Application = require("../models/mongodb/Application");
const fs = require("fs/promises");

const deleteDocument = async (userId, documentId) => {
  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.verificationStatus === "VERIFIED") {
    throw new Error(
      "Verified documents cannot be deleted"
    );
  }

  try {
    await fs.unlink(document.filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await Document.deleteOne({
    _id: documentId,
  });

  return true;
};
const uploadDocument = async (
  userId,
  documentType,
  file
) => {
  if (!documentType) {
    throw new Error("Document type is required");
  }

  if (!file) {
    throw new Error("Document file is required");
  }

  const application = await Application.findOne({
    userId,
  }).lean();

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status === "APPROVED") {
    throw new Error(
      "Documents cannot be uploaded after application approval"
    );
  }

  const document = await Document.create({
    applicationId: application.applicationId,
    userId,
    documentType,
    fileName: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
  });

  return document;
};

const getDocuments = async (userId) => {
  const documents = await Document.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return documents;
};

const getAllDocuments = async () => {
  const documents = await Document.find()
    .sort({ createdAt: -1 })
    .lean();

  return documents;
};
const getDocumentById = async (documentId) => {
  const document = await Document.findById(
    documentId
  ).lean();

  return document;
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
};