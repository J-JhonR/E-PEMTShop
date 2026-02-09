const pool = require('./src/config/db');

async function checkOTP() {
  try {
    const query = "SELECT id, user_id, kind, code, used, created_at, expires_at FROM otp_verifications WHERE kind = 'password_reset' ORDER BY id DESC LIMIT 5";
    const [otps] = await pool.query(query);
    
    console.log('OTPS EXISTANTS:');
    otps.forEach(o => {
      console.log('ID:', o.id, 'Code:', o.code, 'Used:', o.used, 'Expires:', o.expires_at);
    });
    
    await pool.end();
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

checkOTP();
