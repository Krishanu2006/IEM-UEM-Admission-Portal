const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: Number,
      required: true,
      index: true,
    },

    documentType: {
      type: String,
      required: true,
      enum: [
        "PHOTO",
        "SIGNATURE",
        "AADHAAR",
        "CLASS_10_MARKSHEET",
        "CLASS_12_MARKSHEET",
        "OTHER",
      ],
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: [
        "PENDING",
        "VERIFIED",
        "REJECTED",
      ],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Document",
  documentSchema
);