const Application = require("../models/mongodb/Application");
const generateApplicationId = require("../utils/generateApplicationId");

const createApplication = async (userId) => {
  const existingApplication = await Application.findOne({ userId });

  if (existingApplication) {
    return existingApplication;
  }

  const application = await Application.create({
    applicationId: generateApplicationId(),
    userId,
    status: "DRAFT",
  });

  return application;
};

const getApplication = async (userId) => {
  const application = await Application.findOne({ userId });

  return application;
};

const updateApplication = async (userId, data) => {
  const application = await Application.findOne({ userId });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "DRAFT") {
    throw new Error("Only draft applications can be edited");
  }

  // Students may only edit these sections. Fields such as status, userId,
  // applicationId and rejectionReason must never be set from the request body.
  const editableFields = [
    "personalDetails",
    "contactDetails",
    "academicDetails",
    "coursePreferences",
  ];

  for (const field of editableFields) {
    if (data && data[field] !== undefined) {
      application[field] = data[field];
    }
  }

  await application.save();

  return application;
};

const submitApplication = async (userId) => {
  const application = await Application.findOne({ userId });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "DRAFT") {
    throw new Error("Only draft applications can be submitted");
  }

  application.status = "SUBMITTED";

  await application.save();

  return application;
};

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  submitApplication,
};