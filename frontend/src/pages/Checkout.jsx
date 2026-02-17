import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  ArrowLeft,
  ShoppingBag,
  Package,
  Clock,
  ChevronRight,
  Globe,
  Home,
  Wallet,
  Smartphone,
  Building2
} from 'lucide-react';

// Fonctions de validation
const onlyDigits = (value) => String(value || '').replace(/\D/g, '');

const formatCardNumber = (value) => {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (value) => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

// Format téléphone Haïti
const formatPhoneNumber = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, shippingCost, taxAmount, totalAmount, clearCart } = useCart();

  // États simplifiés
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Pour MonCash/Natcash
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Adresse de livraison simplifiée pour Haïti
  const [shippingAddress, setShippingAddress] = useState({
    fullName: isAuthenticated && user ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : '',
    email: isAuthenticated && user ? user?.email || '' : '',
    phone: '',
    addressLine: '',
    city: '',
    department: 'Ouest', // Départements d'Haïti
  });

  const isEmpty = cartItems.length === 0;

  // Validation simplifiée
  const validation = useMemo(() => {
    const hasValidAddress =
      shippingAddress.fullName.trim().length >= 3 &&
      shippingAddress.email.includes('@') &&
      shippingAddress.email.includes('.') &&
      shippingAddress.phone.length >= 8 &&
      shippingAddress.addressLine.trim().length >= 5 &&
      shippingAddress.city.trim().length >= 2;

    let paymentValid = false;
    
    if (paymentMethod === 'card') {
      const cardDigits = onlyDigits(cardNumber);
      paymentValid = 
        cardholderName.trim().length >= 3 &&
        cardDigits.length === 16 &&
        onlyDigits(cvv).length >= 3 &&
        onlyDigits(expiry).length === 4;
    } else if (paymentMethod === 'moncash' || paymentMethod === 'natcash') {
      paymentValid = phoneNumber.length >= 8; // Téléphone valide
    }

    return hasValidAddress && paymentValid && acceptedTerms;
  }, [shippingAddress, paymentMethod, cardNumber, cardholderName, cvv, expiry, phoneNumber, acceptedTerms]);

  // Calculs
  const orderTotal = useMemo(() => Number(totalAmount).toFixed(2), [totalAmount]);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const createBackendOrder = async () => {
    const payload = {
      userId: user?.id || null,
      userEmail: user?.email || '',
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        email: shippingAddress.email.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine: shippingAddress.addressLine.trim(),
        city: shippingAddress.city.trim(),
        postalCode: '',
        country: 'Haiti',
        department: shippingAddress.department
      },
      payment: {
        method: paymentMethod,
        cardLast4: paymentMethod === 'card' ? onlyDigits(cardNumber).slice(-4) : null,
        walletPhone: paymentMethod !== 'card' ? onlyDigits(phoneNumber) : null
      }
    };

    const response = await API.post('/public/checkout/simulate', payload);
    return response?.data?.data || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated || !user?.id) {
      setError('Connectez-vous comme client pour finaliser votre commande.');
      return;
    }

    if (!validation) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    try {
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const orderData = await createBackendOrder();
      clearCart();
      
      navigate('/checkout/success', {
        state: {
          orderId: orderData?.orders?.[0]?.orderNumber || `SIM-${Date.now()}`,
          orderNumbers: (orderData?.orders || []).map((o) => o.orderNumber),
          amount: orderTotal,
          paymentMethod,
          phoneNumber: paymentMethod !== 'card' ? phoneNumber : null,
          cardLast4: paymentMethod === 'card' ? onlyDigits(cardNumber).slice(-4) : null,
          customerName: shippingAddress.fullName
        }
      });
      
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de paiement. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  // Redirection si panier vide
  useEffect(() => {
    if (isEmpty) {
      navigate('/cart');
    }
  }, [isEmpty, navigate]);

  if (isEmpty) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="text-gray-600 hover:text-green-700 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </Link>
            <h1 className="font-semibold text-gray-900">Finaliser la commande</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulaire */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Adresse de livraison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-700" />
                  Adresse de livraison
                </h2>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                    placeholder="Nom complet *"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    required
                  />
                  
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    placeholder="Email *"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    required
                  />
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+509</span>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: onlyDigits(e.target.value).slice(0, 8)})}
                      placeholder="34 56 78 90"
                      className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={shippingAddress.addressLine}
                    onChange={(e) => setShippingAddress({...shippingAddress, addressLine: e.target.value})}
                    placeholder="Adresse (rue, numéro) *"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="Ville *"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      required
                    />
                    
                    <select
                      value={shippingAddress.department}
                      onChange={(e) => setShippingAddress({...shippingAddress, department: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    >
                      <option>Ouest</option>
                      <option>Artibonite</option>
                      <option>Nord</option>
                      <option>Sud</option>
                      <option>Centre</option>
                      <option>Grand'Anse</option>
                      <option>Nippes</option>
                      <option>Nord-Est</option>
                      <option>Nord-Ouest</option>
                      <option>Sud-Est</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-700" />
                  Mode de paiement
                </h2>
                
                {/* Options de paiement Haïti */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-green-700 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-1 ${
                      paymentMethod === 'card' ? 'text-green-700' : 'text-gray-400'
                    }`} />
                    <span className="text-xs">Carte</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('moncash')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'moncash' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 mx-auto mb-1 ${
                      paymentMethod === 'moncash' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="text-xs">MonCash</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('natcash')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      paymentMethod === 'natcash' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 mx-auto mb-1 ${
                      paymentMethod === 'natcash' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-xs">Natcash</span>
                  </button>
                </div>

                {/* Formulaire conditionnel */}
                {paymentMethod === 'card' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                      placeholder="Nom sur la carte"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 uppercase"
                      required
                    />
                    
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        required
                      />
                      
                      <input
                        type="text"
                        inputMode="numeric"
                        value={onlyDigits(cvv).slice(0, 3)}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-3">
                      {paymentMethod === 'moncash' 
                        ? 'Entrez votre numéro MonCash pour recevoir la demande de paiement' 
                        : 'Entrez votre numéro Natcash pour recevoir la demande de paiement'}
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">+509</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        placeholder="34 56 78 90"
                        className="w-full pl-14 pr-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Conditions */}
                <label className="flex items-start gap-2 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 rounded text-green-700 focus:ring-green-500"
                    required
                  />
                  <span className="text-xs text-gray-600">
                    J'accepte les conditions générales de vente
                  </span>
                </label>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Bouton de paiement */}
              <button
                type="submit"
                disabled={processing || !validation}
                className="w-full py-3.5 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl font-semibold hover:from-green-800 hover:to-green-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Payer {orderTotal} Gourdes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Résumé simple */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-green-700" />
                Résumé
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto mb-3 text-sm">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-gray-600">{item.title} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)} G</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{Number(subtotal).toFixed(2)} G</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-green-700">Gratuite</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total</span>
                  <span className="text-green-700">{orderTotal} G</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  Paiement sécurisé
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
