const Application = require("../models/mongodb/Application");

const getApplications = async () => {
  const applications = await Application.find()
    .sort({ createdAt: -1 })
    .lean();

  return applications;
};

const getApplicationById = async (applicationId) => {
  const application = await Application.findOne({
    applicationId,
  }).lean();

  return application;
};

const updateApplicationStatus = async (
  applicationId,
  status,
  rejectionReason = null
) => {
  const application = await Application.findOne({
    applicationId,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const allowedStatuses = [
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid application status");
  }

  if (
    application.status === "APPROVED" ||
    application.status === "REJECTED"
  ) {
    throw new Error("Finalized application cannot be modified");
  }

  if (status === "REJECTED" && !rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  application.status = status;

  application.rejectionReason =
    status === "REJECTED" ? rejectionReason : null;

  await application.save();

  return application;
};

module.exports = {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
};