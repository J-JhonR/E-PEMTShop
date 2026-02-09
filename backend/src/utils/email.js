// Utilitaire simple pour simuler/enregistrer l'envoi d'email (OTP)
module.exports.sendEmail = async ({ to, subject, html }) => {
  if (process.env.SMTP_DISABLED === 'true') {
    console.log('=====================================');
    console.log('📧 EMAIL SIMULÉ ');
    console.log('À :', to);
    console.log('SUJET :', subject);
    console.log('CONTENU :', html);
    console.log('=====================================');
    return;
  }

  // Si plus tard tu veux activer l'envoi réel, place le code nodemailer ici.
  throw new Error('SMTP non configuré (SMTP_DISABLED != true)');
};
