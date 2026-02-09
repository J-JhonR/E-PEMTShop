const db = require('../config/db');

class OTPService {
  static async generateOTP(email, type) {
    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expire dans 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Supprimer les anciens OTP pour cet email/type
    await db.execute(
      'DELETE FROM otp_codes WHERE email = ? AND type = ?',
      [email, type]
    );
    
    // Insérer le nouveau OTP
    await db.execute(
      'INSERT INTO otp_codes (email, code, type, expires_at) VALUES (?, ?, ?, ?)',
      [email, code, type, expiresAt]
    );
    
    return { code, expiresAt };
  }

  static async verifyOTP(email, code, type) {
    const [rows] = await db.execute(
      'SELECT * FROM otp_codes WHERE email = ? AND code = ? AND type = ? AND used = FALSE AND expires_at > NOW()',
      [email, code, type]
    );
    
    return rows.length > 0;
  }

  static async markAsUsed(email, code, type) {
    await db.execute(
      'UPDATE otp_codes SET used = TRUE WHERE email = ? AND code = ? AND type = ?',
      [email, code, type]
    );
  }

  static async deleteExpiredOTPs() {
    await db.execute(
      'DELETE FROM otp_codes WHERE expires_at <= NOW()'
    );
  }
}

module.exports = OTPService;