const applicationService = require("../services/application.service");

const createApplication = async (req, res) => {
  try {
    const application = await applicationService.createApplication(
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplication = async (req, res) => {
  try {
    const application = await applicationService.getApplication(
      req.user.userId
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await applicationService.updateApplication(
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const submitApplication = async (req, res) => {
  try {
    const application = await applicationService.submitApplication(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  submitApplication,
};