import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api"; 

import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  GiftIcon,
  TruckIcon,
  StarIcon,
  TagIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

export default function RegisterClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔒 Vérification de sécurité au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié comme client, rediriger vers l'accueil
    if (token && userRole === "client") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "client",
        newsletter: formData.newsletter,
        acceptTerms: formData.acceptTerms,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erreur lors de l'inscription");
      setIsLoading(false);
      return;
    }

    // stocker temporairement pour l'OTP
    localStorage.setItem("tempEmail", formData.email);
    localStorage.setItem("tempPhone", formData.phone || "");

    setIsLoading(false);
    navigate("/auth/verify-otp?type=client");

  } catch (error) {
    console.error(error);
    alert("Erreur serveur");
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Section gauche - Illustration et avantages */}
        <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-bold text-white inline-flex items-center gap-2">
              <ShoppingBagIcon className="h-8 w-8" />
              PEMT<span className="text-blue-200">Shop</span>
            </Link>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckBadgeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rejoignez-nous !</h3>
                  <p className="text-blue-100 text-sm">Des avantages exclusifs vous attendent</p>
                </div>
              </div>
              <p className="text-blue-100">
                Créez votre compte et bénéficiez d'offres spéciales, d'un suivi personnalisé 
                de vos commandes et d'une expérience shopping unique.
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="flex items-center gap-4 text-white/80 mb-6">
                <div className="flex-1 h-px bg-white/30"></div>
                <span className="text-sm">Avantages PEMTShop</span>
                <div className="flex-1 h-px bg-white/30"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <TagIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">-10%</div>
                  <div className="text-blue-200 text-sm">1ère commande</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <GiftIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">Cadeau</div>
                  <div className="text-blue-200 text-sm">De bienvenue</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <TruckIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">Livraison</div>
                  <div className="text-blue-200 text-sm">Gratuite</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <StarIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">Fidélité</div>
                  <div className="text-blue-200 text-sm">Programme</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-blue-200 text-sm mt-8">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Vos données sont sécurisées</span>
            </div>
          </div>
        </div>
        
        {/* Section droite - Formulaire */}
        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-lg mx-auto">
            {/* Header mobile */}
            <div className="lg:hidden flex items-center justify-between mb-8">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                PEMT<span className="text-blue-600">Shop</span>
              </Link>
              <Link 
                to="/auth/login-client" 
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Se connecter
              </Link>
            </div>
            
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer votre compte
              </h1>
              <p className="text-gray-600">
                Rejoignez PEMTShop et profitez d'une expérience d'achat unique
              </p>
            </div>
            
            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Prénom *
                    </label>
                    <div className="relative group">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Prénom"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom *
                    </label>
                    <div className="relative group">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse email *
                  </label>
                  <div className="relative group">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Email"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone (optionnel)
                  </label>
                  <div className="relative group">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Téléphone"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Mot de passe *
                    </label>
                    <div className="relative group">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Indicateur de force du mot de passe */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`h-4 w-4 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs">8 caractères minimum</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`h-4 w-4 ${passwordStrength.uppercase && passwordStrength.lowercase ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs">Majuscules et minuscules</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`h-4 w-4 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className="text-xs">Au moins un chiffre</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative group">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        required
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                        className="h-5 w-5 appearance-none border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors"
                      />
                      {formData.acceptTerms && (
                        <svg className="absolute inset-0 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      J'accepte les{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline font-medium">
                        Conditions Générales
                      </Link>{" "}
                      et la{" "}
                      <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
                        Politique de Confidentialité
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                        className="h-5 w-5 appearance-none border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors"
                      />
                      {formData.newsletter && (
                        <svg className="absolute inset-0 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      Je souhaite recevoir les offres promotionnelles et actualités de PEMTShop
                    </span>
                  </label>
                </div>

                {/* Bouton d'inscription */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Création du compte...
                    </span>
                  ) : (
                    "Créer mon compte client"
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  En créant un compte, vous acceptez nos conditions et notre politique de confidentialité.
                </p>
              </div>
            </form>

            {/* Liens d'inscription et connexion */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="text-center lg:text-left">
                  <p className="text-gray-600">
                    Déjà un compte ?{" "}
                    <Link 
                      to="/auth/login-client" 
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
                
                <div className="text-center lg:text-right">
                  <p className="text-sm text-gray-600">
                    Vendeur ?{" "}
                    <Link 
                      to="/auth/register-vendor" 
                      className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      Devenir vendeur
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Retour à l'accueil */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Retour à l'accueil</span>
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>Vos données sont protégées et ne seront jamais partagées sans votre consentement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}