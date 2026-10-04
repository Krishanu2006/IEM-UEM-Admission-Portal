const pool = require("../../config/mysql");

const User = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] || null;
  },

  async findByMobile(mobile) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE mobile = ? LIMIT 1",
      [mobile]
    );

    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] || null;
  },

  async updateProfile(id, { fname, lname, mobile }) {
    await pool.execute(
      `UPDATE users
     SET fname = ?, lname = ?, mobile = ?
     WHERE id = ?`,
      [fname, lname, mobile, id]
    );

    return this.findById(id);
  },

  async create({
    fname,
    lname,
    email,
    mobile,
    passwordHash,
    role = "STUDENT",
  }) {
    const [result] = await pool.execute(
      `INSERT INTO users
        (fname, lname, email, mobile, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fname, lname, email, mobile, passwordHash, role]
    );

    return this.findById(result.insertId);
  },
};

module.exports = User;