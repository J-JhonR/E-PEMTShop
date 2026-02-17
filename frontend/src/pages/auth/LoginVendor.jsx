import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import {
  BuildingStorefrontIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  KeyIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";

export default function LoginVendor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    vendorId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔒 Vérification de sécurité au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié comme vendeur, rediriger
    if (token && userRole === "vendor") {
      navigate("/vendor/dashboard", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Erreur de connexion" });
        setIsLoading(false);
        return;
      }

      // 🔐 Sécurité : login VENDOR uniquement
      if (data.role !== "vendor") {
        setErrors({ submit: "Ce compte n'est pas un compte vendeur" });
        setIsLoading(false);
        return;
      }

      // Récupérer les infos complètes du vendeur
      try {
        const vendorInfoResponse = await fetch(`${API_URL}/auth/vendor-info/${formData.email}`);
        const vendorInfo = await vendorInfoResponse.json();

        if (vendorInfoResponse.ok && vendorInfo.success) {
          // Sauvegarder toutes les données
          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("vendorData", JSON.stringify({
            email: formData.email,
            role: data.role,
            token: data.token,
            user: vendorInfo.user,
            vendor: vendorInfo.vendor
          }));
        } else {
          // Fallback si l'endpoint échoue
          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("vendorData", JSON.stringify({
            email: formData.email,
            role: data.role,
            token: data.token
          }));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des infos vendeur:", err);
        // Continuer même si ça échoue
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("vendorData", JSON.stringify({
          email: formData.email,
          role: data.role,
          token: data.token
        }));
      }
      
      setIsLoading(false);
      
      // 🔒 Sécurité : Empêcher le back button après login
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });
      
      navigate("/vendor/dashboard", { replace: true });
      
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Erreur serveur" });
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (vendorType) => {
    // Exemple de connexion rapide pour démo
    setFormData({
      email: vendorType === "demo" ? "demo@vendor.pemtshop.com" : "",
      password: vendorType === "demo" ? "demo1234" : "",
      vendorId: vendorType === "demo" ? "VEND-DEMO123" : "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Header moderne avec glass effect */}
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
                <p className="text-xs text-gray-500">Espace Vendeur Pro</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/auth/register-vendor" 
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Devenir vendeur
              </Link>
              <Link 
                to="/auth/login-client" 
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Espace client
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Carte principale avec effet moderne */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          <div className="p-8 md:p-10">
            {/* En-tête élégant */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-6 shadow-lg">
                <BuildingStorefrontIcon className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-3">
                Tableau de Bord Vendeur
              </h1>
              <p className="text-gray-600">
                Accédez à vos statistiques, commandes et gestion de produits
              </p>
            </div>

            {/* Bannière de sécurité */}
            <div className="mb-8 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1">
                    Connexion sécurisée
                  </h4>
                  <p className="text-sm text-emerald-700">
                    Votre session est chiffrée et protégée. Vos données commerciales sont en sécurité.
                  </p>
                </div>
              </div>
            </div>

            {/* Options de connexion rapide (optionnel) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Connexion rapide</h3>
                <span className="text-xs text-gray-500">Démo</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("demo")}
                  className="group p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Compte démonstration</p>
                        <p className="text-sm text-gray-500">Explorez les fonctionnalités</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Erreur de soumission */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Champ Email */}
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
                    placeholder="contact@entreprise.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">•</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Champ ID Vendeur (optionnel) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ID Vendeur (optionnel)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 bg-white/50"
                    placeholder="VEND-123456"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Requis uniquement pour les comptes multi-boutiques
                </p>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe *
                  </label>
                  <Link 
                    to="/auth/forgot-password-vendor" 
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
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
                    placeholder="••••••••"
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
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${rememberMe ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 group-hover:border-emerald-300'}`}>
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 select-none">Rester connecté</span>
                </label>

                <div className="text-sm">
                  <Link 
                    to="/vendor-support" 
                    className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Support technique
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Connexion en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Accéder au tableau de bord
                      <ChevronRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>

              {/* Retour à l'accueil */}
              <div className="pt-6 border-t border-gray-200">
                <Link
                  to="/"
                  className="group inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Retour à l'accueil
                </Link>
              </div>
            </form>

            {/* Section support et informations */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">
                        Application mobile
                      </h4>
                      <p className="text-xs text-blue-700">
                        Gérez votre boutique depuis notre app mobile disponible sur iOS et Android.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900 mb-1">
                        Première connexion ?
                      </h4>
                      <p className="text-xs text-amber-700">
                        Utilisez les identifiants reçus par email.{" "}
                        <Link to="/vendor-support" className="text-amber-600 hover:text-amber-700 font-medium">
                          Besoin d'aide ?
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lien d'inscription */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de boutique ?{" "}
                  <Link 
                    to="/auth/register-vendor" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Devenir vendeur PEMTShop
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PEMTShop Marketplace. Tous droits réservés.
            <span className="mx-2">•</span>
            <Link to="/vendor-terms" className="hover:text-gray-700">
              Conditions vendeurs
            </Link>
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-gray-700">
              Confidentialité
            </Link>
          </p>
        </div>
      </footer>

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
        
        /* Style pour le loader personnalisé */
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
