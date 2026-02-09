// backend/debug-test.js
const pool = require('./src/config/db');

async function testResetPassword() {
  console.log('🔍 TEST DU SYSTÈME MOT DE PASSE OUBLIÉ');
  console.log('=======================================');
  
  try {
    // 1. Vérifie la connexion à la base
    console.log('1. Test connexion base de données...');
    const [result] = await pool.query('SELECT 1 + 1 AS test');
    console.log('✅ Connexion DB OK:', result[0].test === 2);
    
    // 2. Vérifie la table otp_verifications
    console.log('\n2. Vérification table otp_verifications...');
    const [tables] = await pool.query(`
      SHOW COLUMNS FROM otp_verifications WHERE Field = 'kind'
    `);
    
    if (tables.length > 0) {
      console.log('✅ Colonne "kind" trouvée');
      console.log('   Type:', tables[0].Type);
      console.log('   Accepte "password_reset"?:', tables[0].Type.includes('password_reset'));
    } else {
      console.log('❌ Colonne "kind" non trouvée');
    }
    
    // 3. Cherche un utilisateur de test
    console.log('\n3. Recherche utilisateur test...');
    const [users] = await pool.query('SELECT id, email FROM users LIMIT 3');
    console.log('📊 Utilisateurs trouvés:', users.length);
    users.forEach(user => console.log(`   - ${user.id}: ${user.email}`));
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n4. Test avec utilisateur: ${testUser.email}`);
      
      // 4. Crée un OTP de test
      const testOTP = '123456';
      console.log(`   Création OTP test: ${testOTP}`);
      
      const [insertResult] = await pool.query(
        `INSERT INTO otp_verifications (user_id, kind, code, expires_at, used)
         VALUES (?, 'password_reset', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)`,
        [testUser.id, testOTP]
      );
      console.log(`   ✅ OTP inséré avec ID: ${insertResult.insertId}`);
      
      // 5. Vérifie l'OTP
      const [[otp]] = await pool.query(
        `SELECT * FROM otp_verifications 
         WHERE id = ? AND kind = 'password_reset'`,
        [insertResult.insertId]
      );
      console.log(`   ✅ OTP vérifié:`, otp ? 'OUI' : 'NON');
      
      // 6. Test changement mot de passe
      console.log('\n5. Test changement mot de passe...');
      const testHash = await require('bcrypt').hash('nouveaumdp123', 10);
      const [updateResult] = await pool.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [testHash, testUser.id]
      );
      console.log(`   ✅ Mot de passe changé: ${updateResult.affectedRows} ligne(s) affectée(s)`);
      
      // Nettoyage
      await pool.query('DELETE FROM otp_verifications WHERE id = ?', [insertResult.insertId]);
      console.log('   🧹 OTP test nettoyé');
    }
    
    console.log('\n🎉 TEST COMPLETÉ AVEC SUCCÈS!');
    
  } catch (error) {
    console.error('🔥 ERREUR DURANT LE TEST:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
    process.exit();
  }
}

testResetPassword();