const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  static async sendVerificationEmail(email, otpCode, firstName) {
    const mailOptions = {
      from: `"PEMTShop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Vérification de votre email - PEMTShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Bienvenue sur PEMTShop !</h2>
          <p>Bonjour ${firstName},</p>
          <p>Merci de vous être inscrit sur PEMTShop. Voici votre code de vérification :</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #3B82F6; letter-spacing: 5px; font-size: 32px;">${otpCode}</h1>
          </div>
          <p>Ce code expirera dans 15 minutes.</p>
          <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            © 2024 PEMTShop. Tous droits réservés.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de vérification envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  static async sendVendorWelcomeEmail(email, otpCode, firstName, businessName) {
    const mailOptions = {
      from: `"PEMTShop Marketplace" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Bienvenue sur la marketplace PEMTShop !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Félicitations ${firstName} !</h2>
          <p>Votre demande d'inscription en tant que vendeur pour <strong>${businessName}</strong> a été reçue.</p>
          <p>Voici votre code de vérification :</p>
          <div style="background: #f0fdf4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
            <h1 style="color: #10B981; letter-spacing: 5px; font-size: 32px;">${otpCode}</h1>
          </div>
          <p>Ce code expirera dans 15 minutes.</p>
          <p>Notre équipe va examiner votre dossier et vous contactera sous 48h.</p>
          <p>En attendant, vous pouvez compléter votre profil vendeur.</p>
          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            © 2024 PEMTShop Marketplace. Tous droits réservés.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email vendeur envoyé à ${email}`);
      return true;
    } catch (error) {
      console.error('Erreur envoi email vendeur:', error);
      return false;
    }
  }
}

module.exports = EmailService;