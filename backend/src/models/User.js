const db = require('../config/database');
const crypto = require('crypto');

class User {
  static async createClient(data) {
    const {
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      newsletter,
      verificationToken
    } = data;

    const uuid = crypto.randomUUID();
    
    const [result] = await db.execute(
      `INSERT INTO clients (uuid, first_name, last_name, email, phone, password_hash, newsletter, verification_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, firstName, lastName, email, phone, passwordHash, newsletter, verificationToken]
    );
    
    return { id: result.insertId, uuid };
  }

  static async findClientByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM clients WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findClientByUUID(uuid) {
    const [rows] = await db.execute(
      'SELECT * FROM clients WHERE uuid = ?',
      [uuid]
    );
    return rows[0];
  }

  static async verifyClientEmail(email) {
    await db.execute(
      'UPDATE clients SET email_verified = TRUE, verification_token = NULL WHERE email = ?',
      [email]
    );
  }

  static async updateClientPassword(email, passwordHash) {
    await db.execute(
      'UPDATE clients SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );
  }
}

module.exports = User;