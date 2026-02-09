const pool = require('./src/config/db');

async function checkOTPState() {
  try {
    const [otps] = await pool.query(`
      SELECT id, user_id, kind, code, used, created_at, expires_at
      FROM otp_verifications 
      WHERE kind = 'password_reset'
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('OTPS EXISTANTS (5 derniers):');
    otps.forEach(otp => {
      console.log('ID:', otp.id, 'User:', otp.user_id, 'Code:', otp.code, 'Used:', otp.used);
      console.log('  Created:', otp.created_at);
      console.log('  Expires:', otp.expires_at);
    });
    
    await pool.end();
  } catch (error) {
    console.error('ERREUR:', error.message);
  }
}

checkOTPState();
