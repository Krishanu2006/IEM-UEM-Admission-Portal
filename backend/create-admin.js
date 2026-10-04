require("dotenv").config();

const bcrypt = require("bcryptjs");
const mysqlPool = require("./src/config/mysql");

const createAdmin = async () => {
  try {
    const passwordHash = await bcrypt.hash("Admin@123", 12);

    const [result] = await mysqlPool.execute(
      `INSERT INTO users
        (fname, lname, email, mobile, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "System",
        "Admin",
        "admin@iem.edu",
        "9000000000",
        passwordHash,
        "ADMIN",
      ]
    );

    console.log("Admin created successfully");
    console.log("Admin ID:", result.insertId);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();