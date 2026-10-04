const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/mysql/User");

const registerStudent = async ({
  fname,
  lname,
  email,
  mobile,
  password,
}) => {
  const existingEmail = await User.findByEmail(email);

  if (existingEmail) {
    throw new Error("Email is already registered");
  }

  const existingMobile = await User.findByMobile(mobile);

  if (existingMobile) {
    throw new Error("Mobile number is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    fname,
    lname,
    email,
    mobile,
    passwordHash,
    role: "STUDENT",
  });

  return {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

const loginAdmin = async ({ email, password }) => {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

module.exports = {
  registerStudent,
  login,
  loginAdmin,
};