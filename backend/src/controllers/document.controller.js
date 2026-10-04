const documentService = require("../services/document.service");

const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;

    const document = await documentService.uploadDocument(
      req.user.userId,
      documentType,
      req.file
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await documentService.getDocuments(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};
const deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocument(
      req.user.userId,
      req.params.documentId
    );

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents =
      await documentService.getAllDocuments();

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};
const getAdminDocumentFile = async (req, res) => {
  try {
    const document =
      await documentService.getDocumentById(
        req.params.documentId
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const fs = require("fs");

    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found",
      });
    }

    res.setHeader(
      "Content-Type",
      document.mimeType
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.fileName}"`
    );

    res.sendFile(document.filePath);
  } catch (error) {
    console.error(
      "Failed to serve document file:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to open document",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  getAllDocuments,
  getAdminDocumentFile,
};