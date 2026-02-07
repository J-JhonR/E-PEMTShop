const Joi = require('joi');

const validation = {
  validateClientRegistration: (req, res, next) => {
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne doit pas dépasser 100 caractères',
        'any.required': 'Le prénom est requis'
      }),
      lastName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne doit pas dépasser 100 caractères',
        'any.required': 'Le nom est requis'
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'L\'email est requis'
      }),
      phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/).optional().messages({
        'string.pattern.base': 'Numéro de téléphone invalide'
      }),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
          'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
          'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
          'any.required': 'Le mot de passe est requis'
        }),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Les mots de passe ne correspondent pas',
        'any.required': 'La confirmation du mot de passe est requise'
      }),
      acceptTerms: Joi.boolean().valid(true).required().messages({
        'any.only': 'Vous devez accepter les conditions générales'
      }),
      newsletter: Joi.boolean().default(true)
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }
    next();
  },

  validateVendorRegistration: (req, res, next) => {
    const schema = Joi.object({
      // Étape 1
      firstName: Joi.string().min(2).max(100).required(),
      lastName: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      
      // Étape 2
      businessName: Joi.string().min(2).max(255).required(),
      businessType: Joi.string().required(),
      website: Joi.string().uri().optional().allow(''),
      taxId: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().optional(),
      
      // Étape 3
      productCategories: Joi.array().items(Joi.string()).min(1).required(),
      monthlyVolume: Joi.string().optional().allow(''),
      acceptTerms: Joi.boolean().valid(true).required(),
      acceptVendorAgreement: Joi.boolean().valid(true).required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }
    next();
  },

  validateOTPVerification: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
      type: Joi.string().valid('email_verification', 'vendor_registration', 'password_reset').required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  }
};

module.exports = validation;