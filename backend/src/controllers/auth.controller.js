const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = await authService.registerStudent(req.body);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
const getMe = async (req, res) => {
  try {
    const User = require("../models/mysql/User");

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};
const loginAdmin = async (req, res) => {
  try {
    const result = await authService.loginAdmin(req.body);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  loginAdmin,
};