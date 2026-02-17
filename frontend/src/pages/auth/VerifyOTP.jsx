import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../config/api";
import {
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("client");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = useRef([]);

  /* =====================================================
     SÉCURITÉ - VÉRIFIER SI DÉJÀ AUTHENTIFIÉ
     ===================================================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié, rediriger selon le rôle
    if (token && userRole) {
      if (userRole === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
      } else if (userRole === "client") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  /* =====================================================
     INITIALISATION DES DONNÉES
     ===================================================== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "client";
    const emailFromUrl = params.get("email");
    const emailFromStorage = localStorage.getItem("tempEmail");

    if (!emailFromUrl && !emailFromStorage) {
      alert("Email manquant pour la vérification OTP");
      navigate("/auth/login");
      return;
    }

    setUserType(type);
    setEmail(emailFromUrl || emailFromStorage);
    setPhone(localStorage.getItem("tempPhone") || "");
  }, [location, navigate]);

  /* ======================
     TIMER OTP
     ====================== */
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ======================
     GESTION INPUT OTP
     ====================== */
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMessage("");

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const numbers = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    numbers.split("").forEach((n, i) => (newOtp[i] = n));
    setOtp(newOtp);
    setErrorMessage("");
  };

  /* ======================
     SOUMISSION OTP
     ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Veuillez entrer les 6 chiffres du code");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Code OTP invalide. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }

      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempPhone");
      localStorage.setItem("token", data.token);

      setIsVerified(true);

      setTimeout(() => {
        navigate(data.role === "vendor" ? "/auth/login-vendor" : "/");
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur de connexion au serveur. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  /* ======================
     RENVOI OTP
     ====================== */
  const handleResendOTP = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setErrorMessage("");
    inputRefs.current[0]?.focus();
    
    // Simulation d'envoi d'OTP
    console.log("Renvoi OTP pour :", email);
  };

  const getGradient = () => {
    return userType === "vendor" 
      ? "from-emerald-500 to-green-600"
      : "from-blue-500 to-indigo-600";
  };

  const getBgColor = () => {
    return userType === "vendor" 
      ? "bg-gradient-to-br from-emerald-50 to-green-50"
      : "bg-gradient-to-br from-blue-50 to-indigo-50";
  };

  return (
    <div className={`min-h-screen ${getBgColor()} flex flex-col`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getGradient()} flex items-center justify-center`}>
                <ShieldCheckIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PEMT<span className={userType === "vendor" ? "text-emerald-600" : "text-blue-600"}>Shop</span>
                {userType === "vendor" && (
                  <span className="ml-2 text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    Vendeur
                  </span>
                )}
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to={userType === "vendor" ? "/auth/login-vendor" : "/auth/login-client"}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header avec gradient */}
            <div className={`bg-gradient-to-r ${getGradient()} p-6`}>
              <div className="flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mt-4">
                Vérification de sécurité
              </h1>
              <p className="text-white/90 text-center mt-2 text-sm">
                Protégez votre compte avec notre authentification à deux facteurs
              </p>
            </div>

            {/* Contenu */}
            <div className="p-8">
              {isVerified ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Vérification réussie ! 🎉
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {userType === "vendor" 
                      ? "Votre compte vendeur est maintenant sécurisé et activé."
                      : "Votre compte client est maintenant sécurisé et activé."}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    <span>Redirection en cours...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Informations de contact */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 border border-gray-100">
                      <EnvelopeIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Nous avons envoyé un code de vérification à 6 chiffres à :
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{email}</span>
                      </div>
                      {phone && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Formulaire OTP */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                        Code de vérification
                      </label>
                      <div className="flex justify-center gap-3 mb-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className={`
                              w-14 h-14 text-center text-2xl font-bold 
                              border-2 rounded-xl focus:outline-none 
                              transition-all duration-200
                              ${digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                              hover:border-gray-300
                            `}
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        Utilisez Ctrl+V pour coller le code entier
                      </p>
                    </div>

                    {/* Message d'erreur */}
                    {errorMessage && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">{errorMessage}</span>
                        </div>
                      </div>
                    )}

                    {/* Bouton de soumission */}
                    <button
                      type="submit"
                      disabled={isLoading || otp.join("").length !== 6}
                      className={`
                        w-full py-4 px-4 rounded-xl font-medium text-white 
                        bg-gradient-to-r ${getGradient()}
                        hover:opacity-95 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md hover:shadow-lg
                      `}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                          Vérification en cours...
                        </span>
                      ) : (
                        "Vérifier et continuer"
                      )}
                    </button>
                  </form>

                  {/* Timer et renvoi */}
                  <div className="mt-8 text-center space-y-4">
                    <div className="text-sm text-gray-600">
                      {timer > 0 ? (
                        <div className="flex items-center justify-center space-x-2">
                          <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            Vous pourrez renvoyer le code dans{" "}
                            <span className="font-semibold text-gray-900">{timer}s</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span className="font-medium">Vous pouvez maintenant renvoyer le code</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend}
                      className={`
                        text-sm font-medium transition-colors
                        ${canResend 
                          ? `text-blue-600 hover:text-blue-700 hover:underline` 
                          : 'text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Renvoyer le code de vérification
                    </button>
                  </div>

                  {/* Informations importantes */}
                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex">
                      <XCircleIcon className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-800 mb-2">
                          Vous n'avez pas reçu le code ?
                        </h3>
                        <ul className="text-xs text-amber-700 space-y-1">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Vérifiez votre dossier spam/courrier indésirable
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Assurez-vous que l'adresse {email} est correcte
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            Le code expire automatiquement après 10 minutes
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <p className="text-sm text-gray-600">
                  Besoin d'aide ?{" "}
                  <Link 
                    to="/support" 
                    className={`font-medium hover:underline ${
                      userType === "vendor" ? "text-emerald-600" : "text-blue-600"
                    }`}
                  >
                    Contacter le support
                  </Link>
                </p>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Sécurisé par PEMTShop
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information complémentaire */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              En vérifiant votre compte, vous acceptez nos{" "}
              <Link to="/terms" className="underline hover:text-gray-700">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link to="/privacy" className="underline hover:text-gray-700">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}