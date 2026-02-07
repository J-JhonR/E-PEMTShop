const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

// Routes d'inscription
router.post('/register/client', 
  validation.validateClientRegistration, 
  authController.registerClient
);

router.post('/register/vendor', 
  validation.validateVendorRegistration, 
  authController.registerVendor
);

// Vérification OTP
router.post('/verify-otp', 
  validation.validateOTPVerification,
  authController.verifyOTP
);

// Renvoyer OTP
router.post('/resend-otp', authController.resendOTP);

// Vérifier disponibilité email
router.get('/check-email', authController.checkEmailAvailability);

module.exports = router;