const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const OTPService = require('../utils/otpService');
const EmailService = require('../utils/emailService');

const authController = {
  // Inscription client
  registerClient: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        newsletter,
        acceptTerms
      } = req.body;

      // Validation
      if (!acceptTerms) {
        return res.status(400).json({
          success: false,
          message: 'Vous devez accepter les conditions générales'
        });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await User.findClientByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Générer un token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Créer l'utilisateur
      const user = await User.createClient({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        newsletter: newsletter || true,
        verificationToken
      });

      // Générer et envoyer un OTP
      const otp = await OTPService.generateOTP(email, 'email_verification');
      
      // Envoyer email de vérification
      await EmailService.sendVerificationEmail(email, otp.code, firstName);

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès. Veuillez vérifier votre email.',
        data: {
          userId: user.uuid,
          email: email,
          requiresVerification: true
        }
      });

    } catch (error) {
      console.error('Erreur inscription client:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription'
      });
    }
  },

  // Inscription vendeur
  registerVendor: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        businessName,
        businessType,
        website,
        taxId,
        address,
        city,
        postalCode,
        country,
        productCategories,
        monthlyVolume,
        acceptTerms,
        acceptVendorAgreement
      } = req.body;

      // Validation des conditions
      if (!acceptTerms || !acceptVendorAgreement) {
        return res.status(400).json({
          success: false,
          message: 'Vous devez accepter toutes les conditions'
        });
      }

      // Vérifier si l'email existe déjà (client ou vendeur)
      const existingClient = await User.findClientByEmail(email);
      const existingVendor = await Vendor.findByEmail(email);
      
      if (existingClient || existingVendor) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Générer un token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Créer le vendeur
      const vendor = await Vendor.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        businessName,
        businessType,
        website,
        taxId,
        address,
        city,
        postalCode,
        country,
        productCategories: productCategories || [],
        monthlyVolume,
        verificationToken
      });

      // Générer et envoyer un OTP
      const otp = await OTPService.generateOTP(email, 'vendor_registration');
      
      // Envoyer email de bienvenue vendeur
      await EmailService.sendVendorWelcomeEmail(
        email, 
        otp.code, 
        firstName, 
        businessName
      );

      res.status(201).json({
        success: true,
        message: 'Inscription vendeur enregistrée. Vérification en attente.',
        data: {
          vendorId: vendor.uuid,
          email: email,
          businessName: businessName,
          status: 'pending',
          requiresVerification: true
        }
      });

    } catch (error) {
      console.error('Erreur inscription vendeur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'inscription vendeur'
      });
    }
  },

  // Vérification OTP
  verifyOTP: async (req, res) => {
    try {
      const { email, code, type } = req.body;

      if (!email || !code || !type) {
        return res.status(400).json({
          success: false,
          message: 'Email, code et type sont requis'
        });
      }

      const isValid = await OTPService.verifyOTP(email, code, type);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Code OTP invalide ou expiré'
        });
      }

      // Marquer le code comme utilisé
      await OTPService.markAsUsed(email, code, type);

      // Marquer l'email comme vérifié selon le type
      if (type === 'email_verification') {
        await User.verifyClientEmail(email);
      } else if (type === 'vendor_registration') {
        await Vendor.verifyVendorEmail(email);
      }

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      });

    } catch (error) {
      console.error('Erreur vérification OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la vérification'
      });
    }
  },

  // Renvoyer OTP
  resendOTP: async (req, res) => {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        return res.status(400).json({
          success: false,
          message: 'Email et type sont requis'
        });
      }

      // Vérifier si l'utilisateur existe
      let user;
      if (type === 'email_verification') {
        user = await User.findClientByEmail(email);
      } else if (type === 'vendor_registration') {
        user = await Vendor.findByEmail(email);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Générer un nouveau OTP
      const otp = await OTPService.generateOTP(email, type);
      
      // Envoyer l'email
      let emailSent = false;
      if (type === 'email_verification') {
        emailSent = await EmailService.sendVerificationEmail(
          email, 
          otp.code, 
          user.first_name
        );
      } else if (type === 'vendor_registration') {
        emailSent = await EmailService.sendVendorWelcomeEmail(
          email, 
          otp.code, 
          user.first_name, 
          user.business_name
        );
      }

      if (emailSent) {
        res.json({
          success: true,
          message: 'Nouveau code envoyé avec succès'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email'
        });
      }

    } catch (error) {
      console.error('Erreur renvoi OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  },

  // Vérifier disponibilité email
  checkEmailAvailability: async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requis'
        });
      }
      
      const clientExists = await User.findClientByEmail(email);
      const vendorExists = await Vendor.findByEmail(email);
      
      res.json({
        success: true,
        available: !clientExists && !vendorExists
      });

    } catch (error) {
      console.error('Erreur vérification email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }
};

module.exports = authController;