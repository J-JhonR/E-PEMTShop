import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Minus, 
  Plus, 
  Tag, 
  Shield, 
  Truck,
  CreditCard,
  Lock,
  Gift,
  Percent,
  CheckCircle,
  AlertCircle,
  Package,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    subtotal,
    shippingCost,
    taxAmount,
    discountAmount,
    totalAmount,
    removeFromCart,
    updateCartQty,
    clearCart
  } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const isEmpty = cartItems.length === 0;

  // Simulation de produits suggérés
  useEffect(() => {
    if (!isEmpty) {
      // Simuler des suggestions basées sur le panier
      setSuggestedProducts([
        { id: 1, name: "Accessoire Premium", price: 29.99, image: null },
        { id: 2, name: "Pack Protection", price: 19.99, image: null },
        { id: 3, name: "Garantie Étendue", price: 14.99, image: null }
      ]);
    }
  }, [isEmpty]);

  const applyPromoCode = () => {
    setPromoError('');
    const code = promoCode.toUpperCase().trim();
    
    const validCodes = {
      'WELCOME10': 10,
      'PEMT20': 20,
      'FLASH15': 15,
      'SPECIAL25': 25
    };

    if (validCodes[code]) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  const removePromoCode = () => {
    setPromoApplied(false);
    setPromoCode('');
  };

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  const progressToFreeShipping = subtotal >= 100 ? 100 : (subtotal / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header Amélioré */}
      <div className="relative bg-gradient-to-r from-green-900 to-emerald-800 text-white overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Pattern de points */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold">Votre Panier</h1>
              </div>
              <p className="text-emerald-100 text-lg">
                {isEmpty ? 'Commencez vos achats' : `${cartCount} article${cartCount > 1 ? 's' : ''} dans votre panier`}
              </p>
            </div>
            
            {!isEmpty && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <p className="text-sm text-emerald-100 mb-1">Total du panier</p>
                <p className="text-3xl font-bold">{subtotal.toFixed(2)} €</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-40 h-40 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
            >
              <ShoppingBag className="w-20 h-20 text-green-700" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Découvrez notre collection et trouvez les produits qui vous correspondent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl hover:from-green-800 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg shadow-green-200 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Découvrir nos produits
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-green-700 text-green-700 rounded-xl hover:bg-green-50 transition-all transform hover:scale-105 font-semibold"
              >
                <Gift className="w-5 h-5" />
                Voir les promotions
              </Link>
            </div>

            {/* Suggestions */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-gray-500 mb-4">Vous pourriez aimer :</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-2"></div>
                    <p className="text-sm font-medium text-gray-900">Produit {i}</p>
                    <p className="text-xs text-gray-500">À partir de 29.99 €</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Colonne principale */}
            <div className="lg:col-span-2 space-y-4">
              {/* Barre de progression livraison gratuite */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
              >
                {subtotal < 100 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Plus que <span className="text-green-700 font-bold">{(100 - subtotal).toFixed(2)} €</span> pour la livraison gratuite
                      </span>
                      <span className="text-sm font-medium text-green-700">{progressToFreeShipping.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToFreeShipping}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-green-700">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Félicitations ! Vous bénéficiez de la livraison gratuite !</span>
                  </div>
                )}
              </motion.div>

              {/* Liste des articles */}
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image avec overlay */}
                      <div className="relative sm:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {item.compare_price && item.compare_price > item.price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{Math.round(((item.compare_price - item.price) / item.compare_price) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <Link
                                to={`/products/${item.slug}`}
                                className="text-lg font-semibold text-gray-900 hover:text-green-700 transition-colors"
                              >
                                {item.title}
                              </Link>
                              
                              {/* Rating simulé */}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">(124 avis)</span>
                              </div>
                              
                              <p className="text-sm text-gray-500 mt-2">
                                Vendueur certifié • En stock
                              </p>
                            </div>

                            {/* Actions rapides */}
                            <div className="flex gap-1">
                              <button
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                onClick={() => removeFromCart(item.productId)}
                                title="Retirer du panier"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                            {/* Quantity Controls améliorés */}
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-3">Quantité:</span>
                              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <button
                                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-14 text-center font-semibold text-gray-900">{item.quantity}</span>
                                <button
                                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Price amélioré */}
                            <div className="text-right">
                              <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-green-700">
                                  {(item.price * item.quantity).toFixed(2)} €
                                </p>
                                {item.compare_price > item.price && (
                                  <p className="text-sm text-gray-400 line-through">
                                    {(item.compare_price * item.quantity).toFixed(2)} €
                                  </p>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {(item.price).toFixed(2)} € / unité
                              </p>
                            </div>
                          </div>

                          {/* Stock Warning amélioré */}
                          {item.quantity >= item.stock - 2 && item.stock > 0 && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              <span>Plus que {item.stock - item.quantity} disponible{item.stock - item.quantity > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Cart Actions améliorées */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <Link
                  to="/products"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Continuer mes achats
                </Link>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors hover:bg-red-50 px-4 py-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Vider le panier
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <Package className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>

              {/* Produits suggérés */}
              {suggestedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-700" />
                    Complétez votre commande
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestedProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 bg-white p-3 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.price.toFixed(2)} €</p>
                        </div>
                        <button className="text-green-700 hover:text-green-800 text-sm font-medium">
                          + Ajouter
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary - Colonne latérale */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-6 sticky top-4 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-700" />
                  Résumé de la commande
                </h2>

                {/* Détails de livraison */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Livraison estimée</p>
                      <p className="text-xs text-gray-600">Entre le {getDeliveryDate()} et le {getDeliveryDate()}</p>
                    </div>
                  </div>
                </div>

                {/* Promo Code amélioré */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code promo
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="EX: WELCOME10"
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        disabled={promoApplied}
                      />
                    </div>
                    {!promoApplied ? (
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Appliquer
                      </button>
                    ) : (
                      <button
                        onClick={removePromoCode}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                  
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {promoError}
                    </p>
                  )}
                  
                  {promoApplied && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg flex items-center justify-between">
                      <p className="text-sm text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Code appliqué : -10%
                      </p>
                      <span className="text-xs text-gray-500">WELCOME10</span>
                    </div>
                  )}

                  {/* Liste des codes */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {['WELCOME10', 'PEMT20', 'FLASH15'].map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setPromoCode(code);
                          applyPromoCode();
                        }}
                        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 px-2 rounded-lg transition-colors"
                        disabled={promoApplied}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals améliorés */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-600 group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                    <span className="flex items-center gap-2">
                      Sous-total
                    </span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      Livraison
                    </span>
                    <div className="text-right">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Gratuite</span>
                      ) : (
                        <span>{shippingCost.toFixed(2)} €</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 group hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-gray-400" />
                      Taxes (10%)
                    </span>
                    <span>{taxAmount.toFixed(2)} €</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-700 bg-green-50 p-2 rounded-lg">
                      <span className="flex items-center gap-2 font-medium">
                        <Gift className="w-4 h-4" />
                        Réduction
                      </span>
                      <span className="font-bold">-{(subtotal * 0.1).toFixed(2)} €</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 mt-2 border-t-2 border-gray-200">
                    <span>Total TTC</span>
                    <span className="text-2xl text-green-700">
                      {(promoApplied ? subtotal * 0.9 : totalAmount).toFixed(2)} €
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-right">
                    Dont TVA : {(promoApplied ? taxAmount * 0.9 : taxAmount).toFixed(2)} €
                  </p>
                </div>

                {/* Checkout Button amélioré */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl font-semibold hover:from-green-800 hover:to-emerald-800 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-200 flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Procéder au paiement sécurisé
                </button>

                {/* Paiements sécurisés améliorés */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Paiement 100% sécurisé par
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img src="https://raw.githubusercontent.com/motdotla/dataset/main/logos/visa.svg" alt="Visa" className="h-6" />
                    <img src="https://raw.githubusercontent.com/motdotla/dataset/main/logos/mastercard.svg" alt="Mastercard" className="h-6" />
                    <img src="https://raw.githubusercontent.com/motdotla/dataset/main/logos/paypal.svg" alt="PayPal" className="h-6" />
                    <img src="https://raw.githubusercontent.com/motdotla/dataset/main/logos/amex.svg" alt="American Express" className="h-6" />
                  </div>
                </div>

                {/* Informations de livraison */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Truck className="w-5 h-5 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Livraison gratuite</p>
                      <p className="text-xs text-gray-500">à partir de 100€ d'achat</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Shield className="w-5 h-5 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Garantie satisfait</p>
                      <p className="text-xs text-gray-500">30 jours pour changer d'avis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Package className="w-5 h-5 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Retours gratuits</p>
                      <p className="text-xs text-gray-500">en point relais</p>
                    </div>
                  </div>
                </div>

                {/* Badge de confiance */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-3 h-3 text-green-700" />
                    Acheteur protégé
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation (si nécessaire) */}
      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsCheckingOut(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Finaliser la commande</h3>
              <p className="text-gray-600 mb-4">
                Redirection vers la page de paiement sécurisé...
              </p>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
