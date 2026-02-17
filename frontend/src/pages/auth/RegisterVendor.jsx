import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api"; 
import {
  BuildingStorefrontIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  TagIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  HeartIcon,
  TrophyIcon,
  GiftIcon,
  CakeIcon,
  BookOpenIcon,
  TruckIcon,
  CubeIcon,
  CogIcon,
  WrenchIcon
} from "@heroicons/react/24/outline";

export default function RegisterVendor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    
    // Étape 2: Informations entreprise
    businessName: "",
    businessType: "",
    website: "",
    taxId: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    
    // Étape 3: Informations supplémentaires
    productCategories: [],
    monthlyVolume: "",
    acceptTerms: false,
    acceptVendorAgreement: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔒 Vérification de sécurité au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié comme vendeur, rediriger vers le dashboard
    if (token && userRole === "vendor") {
      navigate("/vendor/dashboard", { replace: true });
    }
  }, [navigate]);

  const businessTypes = [
    "Particulier",
    "Auto-entrepreneur",
    "SARL",
    "SAS",
    "SA",
    "EURL",
    "Association",
    "Autre"
  ];

  const productCategories = [
    { id: "fashion", name: "Mode & Accessoires", icon: ShoppingBagIcon },
    { id: "electronics", name: "Électronique", icon: DevicePhoneMobileIcon },
    { id: "home", name: "Maison & Jardin", icon: HomeIcon },
    { id: "beauty", name: "Beauté & Santé", icon: HeartIcon },
    { id: "sports", name: "Sports & Loisirs", icon: TrophyIcon },
    { id: "kids", name: "Enfants & Bébés", icon: GiftIcon },
    { id: "food", name: "Alimentation", icon: CakeIcon },
    { id: "books", name: "Livres & Médias", icon: BookOpenIcon },
    { id: "auto", name: "Automobile", icon: TruckIcon },
    { id: "tools", name: "Outils & Matériel", icon: WrenchIcon },
    { id: "industrial", name: "Industriel & Fournitures", icon: CogIcon },
    { id: "other", name: "Autre", icon: CubeIcon }
  ];

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = "Ce champ est requis";
      if (!formData.lastName) newErrors.lastName = "Ce champ est requis";
      if (!formData.email) {
        newErrors.email = "Ce champ est requis";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }
      if (!formData.phone) newErrors.phone = "Ce champ est requis";
      if (!formData.password) {
        newErrors.password = "Ce champ est requis";
      } else if (formData.password.length < 8) {
        newErrors.password = "8 caractères minimum";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Ce champ est requis";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.businessName) newErrors.businessName = "Ce champ est requis";
      if (!formData.businessType) newErrors.businessType = "Ce champ est requis";
      if (!formData.taxId) newErrors.taxId = "Ce champ est requis";
      if (!formData.address) newErrors.address = "Ce champ est requis";
      if (!formData.city) newErrors.city = "Ce champ est requis";
      if (!formData.postalCode) newErrors.postalCode = "Ce champ est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(step)) {
      return;
    }
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms || !formData.acceptVendorAgreement) {
      setErrors({ terms: "Veuillez accepter les conditions" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur inscription vendeur");
      }

      navigate(`/auth/verify-otp?email=${formData.email}`);

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${step >= stepNumber ? 'border-green-500 bg-white shadow-lg' : 'border-gray-300 bg-white'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step >= stepNumber ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {stepNumber}
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
              <span className={`text-xs font-medium transition-colors duration-300 ${step >= stepNumber ? 'text-gray-900' : 'text-gray-500'}`}>
                {stepNumber === 1 && "Personnel"}
                {stepNumber === 2 && "Entreprise"}
                {stepNumber === 3 && "Finalisation"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Header moderne */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <BuildingStorefrontIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  PEMT<span className="text-green-600">Shop</span>
                </h1>
                <p className="text-xs text-gray-500">Marketplace Professionnelle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/auth/login-vendor" 
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Connexion vendeur
              </Link>
              <Link 
                to="/auth/register-client" 
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Inscription client
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Carte principale avec effet glassmorphism */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          <div className="p-8 md:p-12">
            {/* En-tête élégant */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 shadow-lg">
                <BuildingStorefrontIcon className="h-12 w-12 text-emerald-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
                Rejoignez PEMTShop
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Développez votre business en ligne avec notre marketplace professionnelle
              </p>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Étape 1: Informations personnelles */}
              {step === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informations personnelles
                      </h2>
                      <p className="text-gray-500">Remplissez vos coordonnées personnelles</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Prénom *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({ ...formData, firstName: e.target.value });
                            if (errors.firstName) setErrors({...errors, firstName: ''});
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                          placeholder="Prénom"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nom *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({ ...formData, lastName: e.target.value });
                            if (errors.lastName) setErrors({...errors, lastName: ''});
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                          placeholder="Nom"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email professionnel *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({...errors, email: ''});
                        }}
                        className={`w-full pl-10 pr-4 py-3.5 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                        placeholder="Email professionnel"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="mr-1">•</span> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({...errors, phone: ''});
                        }}
                        className={`w-full pl-10 pr-4 py-3.5 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                        placeholder="Téléphone"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="mr-1">•</span> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Mot de passe *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (errors.password) setErrors({...errors, password: ''});
                          }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                          placeholder="Mot de passe"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.password}
                        </p>
                      )}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className={`h-4 w-4 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className="text-xs text-gray-500">8 caractères minimum</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirmer le mot de passe *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                          }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 bg-white/50`}
                          placeholder="Confirmer le mot de passe"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Informations entreprise */}
              {step === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informations de l'entreprise
                      </h2>
                      <p className="text-gray-500">Détails juridiques et coordonnées de votre entreprise</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom de l'entreprise *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => {
                          setFormData({ ...formData, businessName: e.target.value });
                          if (errors.businessName) setErrors({...errors, businessName: ''});
                        }}
                        className={`w-full pl-10 pr-4 py-3.5 border ${errors.businessName ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50`}
                        placeholder="Entreprise"
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="mr-1">•</span> {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Type d'entreprise *
                      </label>
                      <select
                        required
                        value={formData.businessType}
                        onChange={(e) => {
                          setFormData({ ...formData, businessType: e.target.value });
                          if (errors.businessType) setErrors({...errors, businessType: ''});
                        }}
                        className={`w-full py-3.5 px-4 border ${errors.businessType ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50 appearance-none`}
                      >
                        <option value="">Sélectionnez un type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.businessType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Numéro SIRET/TVA *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.taxId}
                          onChange={(e) => {
                            setFormData({ ...formData, taxId: e.target.value });
                            if (errors.taxId) setErrors({...errors, taxId: ''});
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${errors.taxId ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50`}
                          placeholder="123 456 789 00012"
                        />
                      </div>
                      {errors.taxId && (
                        <p className="text-sm text-red-500 flex items-center">
                          <span className="mr-1">•</span> {errors.taxId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Site web (optionnel)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50"
                        placeholder="https://www.votre-boutique.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Adresse de l'entreprise *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            if (errors.address) setErrors({...errors, address: ''});
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50`}
                          placeholder="123 Rue de la Paix"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors({...errors, city: ''});
                          }}
                          className={`w-full py-3.5 px-4 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50`}
                          placeholder="Ville"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={formData.postalCode}
                          onChange={(e) => {
                            setFormData({ ...formData, postalCode: e.target.value });
                            if (errors.postalCode) setErrors({...errors, postalCode: ''});
                          }}
                          className={`w-full py-3.5 px-4 border ${errors.postalCode ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50`}
                          placeholder="Code postal"
                        />
                      </div>
                    </div>
                    {(errors.address || errors.city || errors.postalCode) && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="mr-1">•</span> Tous les champs d'adresse sont requis
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 3: Finalisation */}
              {step === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TagIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Finalisation de l'inscription
                      </h2>
                      <p className="text-gray-500">Dernières informations pour votre boutique</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Catégories de produits *
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Sélectionnez les catégories dans lesquelles vous souhaitez vendre
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <label 
                            key={category.id} 
                            className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${formData.productCategories.includes(category.name) ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-purple-300'}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.productCategories.includes(category.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    productCategories: [...formData.productCategories, category.name]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    productCategories: formData.productCategories.filter(c => c !== category.name)
                                  });
                                }
                              }}
                              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <div className={`p-2 rounded-lg ${formData.productCategories.includes(category.name) ? 'bg-purple-100' : 'bg-gray-100'}`}>
                              <IconComponent className={`h-5 w-5 ${formData.productCategories.includes(category.name) ? 'text-purple-600' : 'text-gray-500'}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Volume mensuel estimé (optionnel)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={formData.monthlyVolume}
                        onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 bg-white/50 appearance-none"
                      >
                        <option value="">Sélectionnez un volume</option>
                        <option value="0-100">0 - 100 articles/mois</option>
                        <option value="100-500">100 - 500 articles/mois</option>
                        <option value="500-1000">500 - 1000 articles/mois</option>
                        <option value="1000+">Plus de 1000 articles/mois</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          required
                          checked={formData.acceptVendorAgreement}
                          onChange={(e) => setFormData({ ...formData, acceptVendorAgreement: e.target.checked })}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contrat Vendeur
                        </label>
                        <p className="text-sm text-gray-600">
                          J'accepte le{" "}
                          <Link to="/vendor-agreement" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                            Contrat Vendeur PEMTShop
                          </Link>{" "}
                          et les conditions financières associées à mon activité sur la marketplace.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          required
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conditions générales
                        </label>
                        <p className="text-sm text-gray-600">
                          J'accepte les{" "}
                          <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                            Conditions Générales d'Utilisation
                          </Link>{" "}
                          et la{" "}
                          <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                            Politique de Confidentialité
                          </Link>{" "}
                          de PEMTShop.
                        </p>
                      </div>
                    </div>
                    
                    {errors.terms && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="mr-1">•</span> {errors.terms}
                      </p>
                    )}
                  </div>

                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-emerald-800 mb-2">
                          Prochaines étapes après l'inscription
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-emerald-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-emerald-500" />
                            Vérification de votre adresse email
                          </li>
                          <li className="flex items-center text-sm text-emerald-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-emerald-500" />
                            Validation de vos documents d'entreprise
                          </li>
                          <li className="flex items-center text-sm text-emerald-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-emerald-500" />
                            Configuration de votre boutique
                          </li>
                          <li className="flex items-center text-sm text-emerald-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-emerald-500" />
                            Formation en ligne gratuite
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="group inline-flex items-center px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Précédent
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="group inline-flex items-center px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Retour à l'accueil
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Étape {step} sur 3
                  </span>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="group inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Suivant
                      <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          Finaliser l'inscription
                          <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
