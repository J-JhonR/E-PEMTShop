// src/pages/auth/ForgotPassword.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verifiedOtpCode, setVerifiedOtpCode] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpInputRefs = useRef([]);

  // 🔒 Vérification de sécurité au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    // Si déjà authentifié comme client, rediriger
    if (token && userRole === "client") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Timer pour renvoi OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Étape 1 : Demander l'email
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Veuillez entrer une adresse email valide");
      setIsLoading(false);
      return;
    }

    try {
      console.log("📧 Envoi de la demande de réinitialisation à:", email);
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("📨 Réponse du backend:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Erreur lors de l'envoi du code");
        setIsLoading(false);
        return;
      }

      // Stocker l'OTP pour le test (si présent dans la réponse)
      if (data.debug_otp) {
        setGeneratedOtp(data.debug_otp);
        console.log("🔑 OTP généré (pour test):", data.debug_otp);
        
        // Afficher une alerte avec l'OTP pour faciliter les tests
        setTimeout(() => {
          alert(`🔐 CODE OTP POUR TEST: ${data.debug_otp}\n\nEmail: ${email}\n\n(Ce message apparaît uniquement en mode développement)`);
        }, 300);
      }

      setStep(2);
      setSuccessMessage(data.message || "Code envoyé avec succès");
      setTimer(60);
      setCanResend(false);

    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setErrorMessage("Erreur de connexion au serveur. Vérifiez que le backend est en marche.");
    } finally {
      setIsLoading(false);
    }
  };

  // Étape 2 : Vérifier l'OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setErrorMessage("Veuillez entrer les 6 chiffres du code");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("🔐 Vérification de l'OTP:", { email, otpCode });
      
      // Appeler l'API pour vérifier l'OTP
      const response = await fetch(`${API_URL}/auth/verify-otp-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: otpCode
        }),
      });

      const data = await response.json();
      console.log("📨 Réponse vérification OTP:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Code OTP invalide ou expiré");
        setIsLoading(false);
        return;
      }

      setVerifiedOtpCode(otpCode);
      setStep(3);
      setSuccessMessage("Code vérifié avec succès !");
      setIsLoading(false);

    } catch (error) {
      console.error("❌ Erreur vérification OTP:", error);
      setErrorMessage("Erreur de connexion au serveur");
      setIsLoading(false);
    }
  };

  // Étape 3 : Réinitialiser le mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const otpCode = verifiedOtpCode;
      console.log("🔄 Réinitialisation du mot de passe pour:", email);

      // Appeler l'API pour vraiment changer le mot de passe
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otpCode,
          newPassword
        }),
      });

      const data = await response.json();
      console.log("📨 Réponse réinitialisation:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Erreur lors de la réinitialisation");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Mot de passe réinitialisé avec succès !");
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/auth/login-client");
      }, 2000);

    } catch (error) {
      console.error("❌ Erreur réinitialisation:", error);
      setErrorMessage("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer l'OTP
  const handleResendOTP = () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setOtp(["", "", "", "", "", ""]);
    handleSubmitEmail(new Event('submit'));
  };

  // Gestion des inputs OTP
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMessage("");

      // Auto-focus sur le champ suivant
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    
    pasteData.split("").forEach((char, i) => {
      if (i < 6) {
        newOtp[i] = char;
      }
    });
    
    setOtp(newOtp);
    setErrorMessage("");
    
    // Focus sur le dernier champ rempli
    const lastIndex = Math.min(pasteData.length, 5);
    if (otpInputRefs.current[lastIndex]) {
      otpInputRefs.current[lastIndex].focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center mt-4">
              {step === 1 && "Mot de passe oublié"}
              {step === 2 && "Vérification OTP"}
              {step === 3 && "Nouveau mot de passe"}
            </h1>
            <p className="text-white/90 text-center mt-2 text-sm">
              {step === 1 && "Entrez votre email pour réinitialiser votre mot de passe"}
              {step === 2 && "Entrez le code de vérification"}
              {step === 3 && "Créez votre nouveau mot de passe"}
            </p>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {/* Messages */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Indicateur d'étapes */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= stepNumber 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {step > stepNumber ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-12 h-1 transition-all duration-300 ${
                        step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Étape 1 : Email */}
            {step === 1 && (
              <form onSubmit={handleSubmitEmail}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="votre@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Entrez l'email associé à votre compte
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le code de vérification"
                  )}
                </button>
              </form>
            )}

            {/* Étape 2 : OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                    Code à 6 chiffres envoyé à
                  </label>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                      <EnvelopeIcon className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">{email}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-all duration-200
                          border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        autoFocus={index === 0}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Utilisez Ctrl+V pour coller le code entier
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                        Vérification en cours...
                      </span>
                    ) : (
                      "Vérifier le code"
                    )}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-600">
                        Vous pourrez renvoyer le code dans{" "}
                        <span className="font-semibold text-gray-900">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={!canResend || isLoading}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Renvoyer le code
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Étape 3 : Nouveau mot de passe */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative group">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Minimum 6 caractères"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Le mot de passe doit contenir au moins 6 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative group">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Retapez votre mot de passe"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                        Réinitialisation en cours...
                      </span>
                    ) : (
                      "Réinitialiser le mot de passe"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Lien de retour */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to="/auth/login-client"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>

        {/* Note pour le développement */}
        {import.meta.env.DEV && generatedOtp && step === 2 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Mode développement activé
                </p>
                <p className="text-xs text-amber-700">
                  Code OTP pour test : <span className="font-mono font-bold">{generatedOtp}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Note de sécurité */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note de sécurité :</strong> Le code de vérification est valable 10 minutes.
            Assurez-vous de ne pas le partager.
          </p>
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
