import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  UploadCloud,
  X,
  Image,
  PenLine,
  CreditCard,
  GraduationCap,
  FileCheck2,
} from "lucide-react";
import StudentLayout from "../../components/layout/StudentLayout";
import PageHeader from "../../components/common/PageHeader";
import SelectField from "../../components/forms/SelectField";
import {
  deleteStudentDocument,
  getStudentDocuments,
  uploadStudentDocument,
} from "../../services/document.api";

const DOCUMENT_TYPES = {
  PHOTO: {
    label: "Photograph",
    description: "Recent passport-size photograph",
    icon: Image,
  },
  SIGNATURE: {
    label: "Signature",
    description: "Scanned / digital signature",
    icon: PenLine,
  },
  AADHAAR: {
    label: "Aadhaar Card",
    description: "Aadhaar card for identity verification",
    icon: CreditCard,
  },
  CLASS_10_MARKSHEET: {
    label: "Secondary Marksheet (Class 10)",
    description: "Class 10 / Secondary examination marksheet",
    icon: GraduationCap,
  },
  CLASS_12_MARKSHEET: {
    label: "Higher Secondary Marksheet (Class 12)",
    description: "Class 12 / Higher Secondary examination marksheet",
    icon: GraduationCap,
  },
  OTHER: {
    label: "Other Supporting Document",
    description: "Any additional document required for admission",
    icon: FileCheck2,
  },
};

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png,.pdf";
const ACCEPTED_FORMAT_LABEL = "JPG, JPEG, PNG or PDF";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function StudentDocuments() {
  const [files, setFiles] = useState([]);
  const [typeLabel, setTypeLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDocuments = useCallback(async () => {
    try {
      const response = await getStudentDocuments();
      setFiles(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const addFile = async (e) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    const documentType = Object.keys(DOCUMENT_TYPES).find(
      (key) => DOCUMENT_TYPES[key].label === typeLabel
    );

    if (!documentType) {
      setError("Please select a document type before choosing a file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and PDF files are allowed.");
      return;
    }

    setUploading(true);

    try {
      await uploadStudentDocument({
        documentType,
        file,
      });

      setMessage(
        `${DOCUMENT_TYPES[documentType].label} uploaded successfully.`
      );

      await loadDocuments();
    } catch (err) {
      const apiMessage = err.response?.data?.message;

      setError(
        apiMessage === "Application not found"
          ? "Please create your admission application before uploading documents."
          : apiMessage || "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (id) => {
    setError("");
    setMessage("");

    try {
      await deleteStudentDocument(id);

      setFiles((current) =>
        current.filter((file) => file._id !== id)
      );

      setMessage("Document deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete document"
      );
    }
  };

  const documentOptions = Object.values(DOCUMENT_TYPES).map(
    (document) => document.label
  );

  return (
    <StudentLayout>
      <section className="content">
        <PageHeader
          eyebrow="DOCUMENT MANAGEMENT"
          title="Required documents"
          description="Upload the documents required to complete your admission application."
        />

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {message && (
          <div className="form-success">
            {message}
          </div>
        )}

        <div className="card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">
                DOCUMENT REQUIREMENTS
              </span>

              <h2>Documents required for admission</h2>
            </div>
          </div>

          <div className="document-requirements">
            {Object.entries(DOCUMENT_TYPES).map(
              ([type, document]) => {
                const Icon = document.icon;

                return (
                  <div
                    className="document-requirement-row"
                    key={type}
                  >
                    <div className="file-icon">
                      <Icon size={20} />
                    </div>

                    <div className="document-info">
                      <strong>{document.label}</strong>
                      <span>{document.description}</span>
                    </div>

                    <small>
                      JPG / JPEG / PNG / PDF · Max 5 MB
                    </small>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="card upload-zone">
          <UploadCloud size={30} />

          <h2>Upload a document</h2>

          <p>
            Select the document type and upload the corresponding
            file.
          </p>

          <div className="upload-requirements">
            <span>
              <strong>Accepted formats:</strong>{" "}
              {ACCEPTED_FORMAT_LABEL}
            </span>

            <span>
              <strong>Maximum file size:</strong> 5 MB per
              document
            </span>
          </div>

          <SelectField
            label="Document type"
            options={documentOptions}
            value={typeLabel}
            onChange={(e) => {
              setTypeLabel(e.target.value);
              setError("");
              setMessage("");
            }}
          />

          {typeLabel && (
            <div className="selected-document-info">
              <strong>{typeLabel}</strong>
              <span>
                {Object.values(DOCUMENT_TYPES).find(
                  (document) =>
                    document.label === typeLabel
                )?.description}
              </span>
            </div>
          )}

          <label className="button button-secondary">
            {uploading ? "Uploading..." : "Choose file"}

            <input
              type="file"
              hidden
              onChange={addFile}
              accept={ACCEPTED_FORMATS}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="card">
          <div className="card-heading">
            <h2>Uploaded documents</h2>

            <span className="muted">
              {files.length}{" "}
              {files.length === 1 ? "file" : "files"}
            </span>
          </div>

          {loading ? (
            <p className="muted">
              Loading documents...
            </p>
          ) : files.length === 0 ? (
            <div className="empty-state">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="document-list">
              {files.map((file) => (
                <div
                  className="document-row"
                  key={file._id}
                >
                  <div className="file-icon">
                    <FileText size={20} />
                  </div>

                  <div className="document-info">
                    <strong>
                      {DOCUMENT_TYPES[file.documentType]?.label ||
                        file.documentType}
                    </strong>

                    <span>
                      {file.fileName} ·{" "}
                      {formatSize(file.fileSize)} ·{" "}
                      {file.verificationStatus}
                    </span>
                  </div>

                  {file.verificationStatus !== "VERIFIED" && (
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        removeFile(file._id)
                      }
                      title="Remove document"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </StudentLayout>
  );
}