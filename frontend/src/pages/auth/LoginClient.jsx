// src/pages/auth/LoginClient.jsx
import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function LoginClient() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔒 Vérification de sécurité au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié comme client, rediriger vers l'accueil
    if (token && userRole === "client") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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
        setErrorMessage(data.message || "Erreur de connexion");
        return;
      }

      // 🔐 Sécurité : login CLIENT uniquement
      if (data.role !== "client") {
        setErrorMessage("Ce compte n'est pas un compte client");
        return;
      }

      // 💾 Utiliser le contexte pour la connexion
      await login(formData.email, formData.password, "client", data);
      
      // La redirection est gérée dans le contexte

    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur serveur");
    }
  };

  // Message d'erreur
  const ErrorMessage = () => {
    if (!errorMessage) return null;
    
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Section gauche - Illustration COMPLÈTE */}
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
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Connectez-vous</h3>
                  <p className="text-blue-100 text-sm">Accédez à votre espace personnel</p>
                </div>
              </div>
              <p className="text-blue-100">
                Gérez vos commandes, suivez vos achats et profitez d'offres exclusives réservées à nos membres.
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="flex items-center gap-4 text-white/80 mb-6">
                <div className="flex-1 h-px bg-white/30"></div>
                <span className="text-sm">Pourquoi nous rejoindre ?</span>
                <div className="flex-1 h-px bg-white/30"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Livraison</div>
                  <div className="text-blue-200 text-sm">Gratuite dès 50€</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Support</div>
                  <div className="text-blue-200 text-sm">24h/24 & 7j/7</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">+500K</div>
                  <div className="text-blue-200 text-sm">Produits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">+1M</div>
                  <div className="text-blue-200 text-sm">Clients satisfaits</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-blue-200 text-sm mt-8">
            © 2024 PEMTShop Marketplace
          </div>
        </div>
        
        {/* Section droite - Formulaire COMPLÈTE */}
        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-lg mx-auto">
            
            {/* Header mobile */}
            <div className="lg:hidden flex items-center justify-between mb-8">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                PEMT<span className="text-blue-600">Shop</span>
              </Link>
              <Link 
                to="/auth/register-client" 
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                S'inscrire
              </Link>
            </div>
            
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Connexion à votre compte
              </h1>
              <p className="text-gray-600">
                Accédez à votre espace client PEMTShop
              </p>
            </div>
            
            {/* Message d'erreur */}
            <ErrorMessage />
            
            {/* Layout horizontal pour boutons sociaux en mode paysage COMPLET */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 mb-8">
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-medium text-gray-700">Google</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-medium text-gray-700">Facebook</span>
              </button>
            </div>
            
            {/* Version verticale pour mobile COMPLÈTE */}
            <div className="lg:hidden space-y-3 mb-8">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-medium text-gray-700">Continuer avec Google</span>
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-medium text-gray-700">Continuer avec Facebook</span>
              </button>
            </div>
            
            {/* Séparateur */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-sm font-medium">
                  Ou continuer avec email
                </span>
              </div>
            </div>
            
            {/* Formulaire COMPLET */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Email"
                      disabled={authLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      disabled={authLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                      disabled={authLoading}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-5 w-5 appearance-none border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors disabled:opacity-50"
                        disabled={authLoading}
                      />
                      {rememberMe && (
                        <svg className="absolute inset-0 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700">Se souvenir de moi</span>
                  </label>
                  
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50"
                    onClick={(e) => authLoading && e.preventDefault()}
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  {/* Effet de chargement */}
                  {authLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Texte du bouton */}
                  <span className="relative flex items-center justify-center gap-2">
                    {authLoading ? (
                      <>
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-5 w-5" />
                        <span>Se connecter</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
            
            {/* Lien d'inscription et retour à l'accueil */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="text-center lg:text-left">
                  <p className="text-gray-600">
                    Pas encore de compte ?{" "}
                    <Link 
                      to="/auth/register-client" 
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      onClick={(e) => authLoading && e.preventDefault()}
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
                
                <div className="text-center lg:text-right">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={(e) => authLoading && e.preventDefault()}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Retour à l'accueil</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>En vous connectant, vous acceptez nos <Link to="/terms" className="text-blue-600 hover:underline">Conditions d'utilisation</Link> et notre <Link to="/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</Link></p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
