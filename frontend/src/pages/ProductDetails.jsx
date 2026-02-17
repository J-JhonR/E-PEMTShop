import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import publicService from '../services/public.service';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  StarHalf,
  CheckCircle,
  AlertCircle,
  Package,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Mail,
  Link as LinkIcon,
  Minus,
  Plus,
  Sparkles,
  Award,
  Leaf,
  Recycle
} from 'lucide-react';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // État
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Constantes
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');
  
  // Variantes simulées
  const colors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Gris', value: '#808080' },
    { name: 'Bleu', value: '#0000FF' }
  ];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Callbacks optimisés
  const resolveImageUrl = useCallback((url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  }, [backendOrigin]);

  const getDeliveryDate = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long'
    });
  }, []);

  // Effets
  useEffect(() => {
    let mounted = true;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicService.getProductBySlug(slug);
        if (!mounted) return;
        setProduct(response.data || null);
      } catch (err) {
        if (!mounted) return;
        setError('Produit introuvable.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProduct();
    
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Fermer le menu de partage au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showShareMenu && !e.target.closest('.share-menu')) {
        setShowShareMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showShareMenu]);

  // Mémoïsation
  const images = useMemo(() => product?.images || [], [product]);
  const selectedImage = useMemo(() => 
    images[selectedImageIndex] || images[0] || null, 
    [images, selectedImageIndex]
  );

  const discountPercentage = useMemo(() => {
    if (!product?.compare_price || !product?.price) return 0;
    if (product.compare_price <= product.price) return 0;
    return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
  }, [product]);

  const isLowStock = useMemo(() => 
    product?.quantity > 0 && product?.quantity < 10, 
    [product?.quantity]
  );

  // Handlers
  const handleQuantityChange = useCallback((newQuantity) => {
    if (!product?.quantity) return;
    setQuantity(Math.min(Math.max(1, newQuantity), product.quantity));
  }, [product?.quantity]);

  const handleAddToCart = useCallback(() => {
    addToCart(
      {
        ...product,
        primary_image: selectedImage?.image_url || product?.primary_image || ''
      },
      quantity
    );
    navigate('/cart');
  }, [addToCart, navigate, product, quantity, selectedImage]);

  const handleBuyNow = useCallback(() => {
    addToCart(
      {
        ...product,
        primary_image: selectedImage?.image_url || product?.primary_image || ''
      },
      quantity
    );
    navigate('/checkout');
  }, [addToCart, navigate, product, quantity, selectedImage]);

  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const shareProduct = useCallback((platform) => {
    const url = window.location.href;
    const text = `Découvrez ${product?.title} sur PEMTShop !`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Lien copié dans le presse-papier !');
        });
        break;
    }
    setShowShareMenu(false);
  }, [product?.title]);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const toggleWishlist = useCallback(() => {
    setIsWishlisted(prev => !prev);
    // Optionnel: Ajouter une notification
  }, []);

  // Rendu conditionnel
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-green-700 rounded-full animate-pulse"></div>
          </div>
          <p className="text-center mt-4 text-gray-600 font-medium">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oups !</h2>
          <p className="text-gray-600 mb-8">{error || 'Produit introuvable.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl hover:from-green-800 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg shadow-green-200 font-medium"
          >
            Retour aux produits
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-500 hover:text-green-700 transition-colors flex items-center gap-1"
            >
              <span>Accueil</span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button 
              onClick={() => navigate('/products')} 
              className="text-gray-500 hover:text-green-700 transition-colors"
            >
              Produits
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Image principale */}
            <div 
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group cursor-zoom-in"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="aspect-square">
                {selectedImage ? (
                  <img
                    src={resolveImageUrl(selectedImage.image_url || selectedImage.thumbnail_url)}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercentage}%
                  </span>
                )}
                {isLowStock && (
                  <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Plus que {product.quantity} en stock
                  </span>
                )}
              </div>

              {/* Flèches de navigation */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                    onClick={handlePrevImage}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                    onClick={handleNextImage}
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Indicateur d'image */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Modal de zoom */}
            <AnimatePresence>
              {showZoom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowZoom(false)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="relative max-w-5xl max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={resolveImageUrl(selectedImage?.image_url || product.primary_image)}
                      alt={product.title}
                      className="max-w-full max-h-[90vh] object-contain"
                      style={{
                        transform: `scale(1.5) translate(${zoomPosition.x}%, ${zoomPosition.y}%)`,
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                    <button
                      className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => setShowZoom(false)}
                      aria-label="Fermer le zoom"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <motion.button
                    key={img.id || idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      idx === selectedImageIndex
                        ? 'border-green-700 shadow-lg shadow-green-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Voir l'image ${idx + 1}`}
                  >
                    <img
                      src={resolveImageUrl(img.thumbnail_url || img.image_url)}
                      alt={img.alt_text || `${product.title} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Informations produit */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* En-tête */}
            <div className="flex items-start justify-between">
              <div>
                {product.vendor && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">Vendu par</span>
                    <button 
                      onClick={() => navigate(`/vendor/${product.vendor.id}`)}
                      className="text-green-700 font-medium hover:underline flex items-center gap-1"
                    >
                      {product.vendor.name}
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
                
                {/* Note */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 4.5].map((star, index) => {
                      const fullStars = 4;
                      if (index < fullStars) {
                        return <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
                      } else if (index === fullStars && 4.5 > fullStars) {
                        return <StarHalf key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
                      } else {
                        return <Star key={index} className="w-5 h-5 text-gray-300" />;
                      }
                    })}
                    <span className="ml-2 text-sm font-medium text-gray-900">4.5/5</span>
                  </div>
                  <span className="text-sm text-gray-500">(124 avis vérifiés)</span>
                  
                  {/* Bouton partage */}
                  <div className="relative share-menu">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Partager"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {/* Menu de partage */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border p-2 z-50 min-w-[200px]"
                        >
                          <button
                            onClick={() => shareProduct('facebook')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 rounded-lg text-left"
                          >
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span>Partager sur Facebook</span>
                          </button>
                          <button
                            onClick={() => shareProduct('twitter')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-sky-50 rounded-lg text-left"
                          >
                            <Twitter className="w-5 h-5 text-sky-500" />
                            <span>Partager sur X</span>
                          </button>
                          <button
                            onClick={() => shareProduct('email')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span>Partager par email</span>
                          </button>
                          <button
                            onClick={() => shareProduct('copy')}
                            className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <LinkIcon className="w-5 h-5 text-gray-600" />
                            <span>Copier le lien</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prix</p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-5xl font-bold text-green-700">
                      {Number(product.price || 0).toFixed(2)} €
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {Number(product.compare_price).toFixed(2)} €
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                          Économisez {Number(product.compare_price - product.price).toFixed(2)} €
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Sparkles className="w-8 h-8 text-green-700 opacity-50 flex-shrink-0" />
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${product.quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <span className="font-medium">
                    {product.quantity > 0 ? 'En stock' : 'Rupture de stock'}
                  </span>
                  {product.quantity > 0 && (
                    <p className="text-sm text-gray-500">
                      {product.quantity} unité{product.quantity > 1 ? 's' : ''} disponible{product.quantity > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Livraison</p>
                <p className="font-medium text-green-700">{getDeliveryDate()}</p>
              </div>
            </div>

            {/* Variantes */}
            {colors && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Couleur : <span className="text-green-700">{selectedColor || 'Sélectionner'}</span>
                </p>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-green-700 scale-110 shadow-lg'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Couleur ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Taille : <span className="text-green-700">{selectedSize || 'Sélectionner'}</span>
                </p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-green-700 bg-green-700 text-white shadow-lg scale-105'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                      aria-label={`Taille ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description courte */}
            <div className="prose prose-gray max-w-none bg-white p-6 rounded-xl border border-gray-100">
              <p className="text-gray-600 leading-relaxed">
                {product.description || product.short_description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Sélecteur quantité */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    className="w-14 h-14 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, Number(product.quantity) || 1)}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-20 h-14 text-center border-x border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-lg"
                    aria-label="Quantité"
                  />
                  <button
                    className="w-14 h-14 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.quantity || 1)}
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Boutons principaux */}
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl hover:from-green-800 hover:to-emerald-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-200 font-semibold disabled:opacity-50 disabled:hover:scale-100"
                  onClick={handleAddToCart}
                  disabled={!product.quantity}
                  aria-label="Ajouter au panier"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:inline">Ajouter au panier</span>
                  <span className="sm:hidden">Panier</span>
                </button>

                <button
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:hover:scale-100 font-semibold"
                  onClick={handleBuyNow}
                  disabled={!product.quantity}
                  aria-label="Acheter maintenant"
                >
                  <span className="hidden sm:inline">Acheter maintenant</span>
                  <span className="sm:hidden">Acheter</span>
                </button>

                <button
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                  }`}
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Infos livraison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 hover:border-green-200 transition-all">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-green-700" />
                  <span className="text-sm font-medium block">Livraison gratuite</span>
                  <span className="text-xs text-gray-500">dès 100€</span>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 hover:border-green-200 transition-all">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-700" />
                  <span className="text-sm font-medium block">Paiement sécurisé</span>
                  <span className="text-xs text-gray-500">CB, PayPal</span>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100 hover:border-green-200 transition-all">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-green-700" />
                  <span className="text-sm font-medium block">Retour gratuit</span>
                  <span className="text-xs text-gray-500">30 jours</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-600">Produit certifié</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-600">Éco-responsable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-green-700" />
                  <span className="text-sm text-gray-600">Recyclable</span>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto pb-1">
                {['description', 'caracteristiques', 'avis'].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-3 px-1 font-medium transition-all relative capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'description' && 'Description'}
                    {tab === 'caracteristiques' && 'Caractéristiques'}
                    {tab === 'avis' && 'Avis clients'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-700 to-emerald-700"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="prose prose-gray max-w-none"
                    >
                      <p className="text-gray-600 leading-relaxed">{product.description || product.short_description}</p>
                      {product.long_description && (
                        <div className="mt-4 text-gray-600" dangerouslySetInnerHTML={{ __html: product.long_description }} />
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'caracteristiques' && (
                    <motion.div
                      key="caracteristiques"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {product.specifications?.length > 0 ? (
                        product.specifications.map((spec, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                            <span className="sm:w-1/3 text-gray-600 font-medium mb-1 sm:mb-0">{spec.name}</span>
                            <span className="sm:w-2/3 text-gray-900">{spec.value}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          Aucune caractéristique technique disponible
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'avis' && (
                    <motion.div
                      key="avis"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Résumé des avis */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div className="text-center flex-shrink-0">
                          <span className="text-4xl font-bold text-green-700">4.5</span>
                          <span className="text-sm text-gray-500 block">/5</span>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="space-y-1">
                            {[5,4,3,2,1].map((star) => (
                              <div key={star} className="flex items-center gap-2">
                                <span className="text-sm w-8">{star} étoiles</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-600 rounded-full"
                                    style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-500 w-12">
                                  {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Avis simulés */}
                      {[1,2,3].map((review) => (
                        <div key={review} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div>
                              <span className="font-medium text-gray-900">Jean D.</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1,2,3,4,5].map((star) => (
                                    <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">Il y a 2 jours</span>
                              </div>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full self-start">Achat vérifié</span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Super produit, conforme à la description. Livraison rapide, je recommande !
                          </p>
                        </div>
                      ))}

                      <button className="w-full py-3 text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors font-medium">
                        Voir tous les avis (124)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 