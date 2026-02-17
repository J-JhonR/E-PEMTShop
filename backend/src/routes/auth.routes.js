const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      password, role = 'client', newsletter = true, acceptTerms = false
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // 1) Vérifier email unique
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ message: 'Email déjà utilisé' });

    // 2) Hash mot de passe
    const hash = await bcrypt.hash(password, 10);

    // 3) Insérer utilisateur
    const [result] = await pool.query(
      `INSERT INTO users
      (email, password_hash, first_name, last_name, phone, role, newsletter, accepted_terms_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email, hash, firstName, lastName, phone || null, role,
        newsletter ? 1 : 0,
        acceptTerms ? new Date() : null
      ]
    );

    // 4) Générer OTP 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO otp_verifications (user_id, kind, code, expires_at)
       VALUES (?, 'email', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [result.insertId, otp]
    );

    // 5) Envoyer (simulé)
    await sendEmail({
      to: email,
      subject: 'Code OTP PEMTShop',
      html: `Votre code OTP est : <b>${otp}</b>. Il expire dans 10 minutes.`
    });

    return res.json({ message: 'Compte créé. Vérifiez l’OTP envoyé.', email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Champs manquants' });

    const [[user]] = await pool.query('SELECT id, role FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const [[otp]] = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE user_id = ? AND code = ? AND used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, code]
    );

    if (!otp) return res.status(400).json({ message: 'OTP invalide ou expiré' });

    // activer compte + marquer otp utilisé
    await pool.query('UPDATE users SET is_active = 1 WHERE id = ?', [user.id]);
    await pool.query('UPDATE otp_verifications SET used = 1 WHERE id = ?', [otp.id]);

    // générer token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    return res.json({ message: 'Compte activé', token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Champs manquants' });

    const [[user]] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, avatar_url, password_hash, is_active, role FROM users WHERE email = ?',
      [email]
    );
    if (!user) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: 'Mot de passe invalide' });

    if (!user.is_active) return res.status(403).json({ message: 'Compte non activé' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    return res.json({
      message: 'Connect�',
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatarUrl: user.avatar_url || null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// POST /api/auth/register-vendor
router.post('/register-vendor', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, password,
      businessName, businessType, website, taxId,
      address, city, postalCode, country,
      productCategories, monthlyVolume,
      acceptTerms
    } = req.body;

    // 1️⃣ validations minimales
    if (!email || !password || !firstName || !lastName || !businessName) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // 2️⃣ email unique
    const [exists] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (exists.length) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // 3️⃣ hash password
    const hash = await bcrypt.hash(password, 10);

    // 4️⃣ créer user (role = vendor)
    const [userResult] = await pool.query(
      `INSERT INTO users
      (email, password_hash, first_name, last_name, phone, role, accepted_terms_at)
      VALUES (?, ?, ?, ?, ?, 'vendor', ?)`,
      [
        email,
        hash,
        firstName,
        lastName,
        phone || null,
        acceptTerms ? new Date() : null
      ]
    );

    const userId = userResult.insertId;

    // 5️⃣ créer vendor
    await pool.query(
      `INSERT INTO vendors
      (user_id, business_name, business_type, website, tax_id,
       address, city, postal_code, country, monthly_volume, product_categories)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        businessName,
        businessType,
        website || null,
        taxId || null,
        address || null,
        city || null,
        postalCode || null,
        country || null,
        monthlyVolume || null,
        JSON.stringify(productCategories || [])
      ]
    );

    // 6️⃣ OTP (réutilise ton système existant)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO otp_verifications (user_id, kind, code, expires_at)
       VALUES (?, 'email', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [userId, otp]
    );

    await sendEmail({
      to: email,
      subject: 'Code OTP PEMTShop (Vendeur)',
      html: `Votre code OTP est : <b>${otp}</b>`
    });

    res.status(201).json({
      message: 'Compte vendeur créé. Vérifiez votre email.',
      email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// AJOUTE CES ROUTES DANS TON FICHIER authRoutes.js
// Juste avant le "module.exports = router;"

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('📧 Forgot password request for:', email);
    
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // 1) Vérifier si l'utilisateur existe
    const [[user]] = await pool.query(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email]
    );

    // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
    if (!user) {
      console.log('⚠️ User not found for email:', email);
      return res.json({ 
        message: 'Si cet email existe, vous recevrez un code de réinitialisation',
        success: true
      });
    }

    console.log('✅ User found:', user.id, user.email, user.role);

    // 2) Générer un OTP de 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔑 Generated OTP:', otp);

    // 3) Sauvegarder l'OTP dans la base de données
    // Note: On utilise 'password_reset' comme kind
    const [otpResult] = await pool.query(
      `INSERT INTO otp_verifications (user_id, kind, code, expires_at)
       VALUES (?, 'password_reset', ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [user.id, otp]
    );

    console.log('💾 OTP saved to database with ID:', otpResult.insertId);

    // 4) Envoyer l'OTP par email
    try {
      await sendEmail({
        to: email,
        subject: 'Réinitialisation de mot de passe - PEMTShop',
        html: `
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Votre code de vérification est : <strong>${otp}</strong></p>
          <p>Ce code expire dans 10 minutes.</p>
          <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
          <hr>
          <p><small>Code OTP: ${otp} (affiché ici pour le test)</small></p>
        `
      });
      console.log('📤 Email sent successfully to:', email);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // On continue même si l'email échoue (pour le test)
    }

    // 5) Retourner une réponse
    return res.json({ 
      message: 'Un code de vérification a été envoyé à votre email',
      success: true,
      email: email,
      debug_otp: otp // À RETIRER EN PRODUCTION - juste pour le test
    });

  } catch (err) {
    console.error('🔥 Erreur forgot-password:', err);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la demande de réinitialisation',
      error: err.message 
    });
  }
});

// POST /api/auth/verify-otp-password-reset
router.post('/verify-otp-password-reset', async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('🔐 Verify OTP for password reset:', { email, code });
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email et code requis' });
    }

    // 1) Vérifier si l'utilisateur existe
    const [[user]] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    // 2) Vérifier l'OTP spécifique pour password_reset
    const [[otp]] = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE user_id = ? 
       AND code = ? 
       AND kind = 'password_reset'
       AND used = 0 
       AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, code]
    );

    if (!otp) {
      console.log('❌ Invalid or expired OTP');
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    console.log('✅ OTP verified successfully');

    // 3) Marquer l'OTP comme utilisé
    await pool.query(
      'UPDATE otp_verifications SET used = 1 WHERE id = ?',
      [otp.id]
    );

    return res.json({ 
      message: 'Code vérifié avec succès',
      success: true,
      verified: true
    });

  } catch (err) {
    console.error('🔥 Erreur verify-otp-password-reset:', err);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la vérification',
      error: err.message 
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    console.log('🔄 Reset password request:', { email, codeLength: code?.length });
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // 1) Vérifier si l'utilisateur existe
    const [[user]] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    // 2) Vérifier que l'OTP a été utilisé (déjà vérifié)
    const [[otp]] = await pool.query(
      `SELECT * FROM otp_verifications
       WHERE user_id = ? 
       AND code = ? 
       AND kind = 'password_reset'
       AND used = 1
       AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, code]
    );

    if (!otp) {
      return res.status(400).json({ 
        message: 'Code non vérifié ou expiré. Veuillez d\'abord vérifier votre code OTP' 
      });
    }

    // 4) Hash du nouveau mot de passe
    const hash = await bcrypt.hash(newPassword, 10);

    // 5) Mettre à jour le mot de passe
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hash, user.id]
    );

    console.log('✅ Password updated for user:', user.id);

    return res.json({ 
      message: 'Mot de passe réinitialisé avec succès',
      success: true
    });

  } catch (err) {
    console.error('🔥 Erreur reset-password:', err);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la réinitialisation',
      error: err.message 
    });
  }
});

// GET /api/auth/vendor-info - Récupérer les infos du vendeur
router.get('/vendor-info/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // 1) Récupérer l'utilisateur
    const [[user]] = await pool.query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE email = ? AND role = "vendor"',
      [email]
    );

    if (!user) {
      return res.status(400).json({ message: 'Vendeur introuvable' });
    }

    // 2) Récupérer les infos du vendeur
    const [[vendor]] = await pool.query(
      `SELECT id, user_id, business_name, business_type, address, city, postal_code, country, 
              website, tax_id, monthly_volume, product_categories, status
       FROM vendors WHERE user_id = ?`,
      [user.id]
    );

    if (!vendor) {
      return res.status(400).json({ message: 'Profil vendeur non trouvé' });
    }

    // 3) Retourner les infos combinées
    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      vendor: {
        id: vendor.id,
        userId: vendor.user_id,
        businessName: vendor.business_name,
        businessType: vendor.business_type,
        address: vendor.address,
        city: vendor.city,
        postalCode: vendor.postal_code,
        country: vendor.country,
        website: vendor.website,
        taxId: vendor.tax_id,
        monthlyVolume: vendor.monthly_volume,
        productCategories: vendor.product_categories,
        status: vendor.status
      }
    });

  } catch (err) {
    console.error('🔥 Erreur vendor-info:', err);
    return res.status(500).json({ 
      message: 'Erreur serveur',
      error: err.message 
    });
  }
});

module.exports = router;



