// components/vendor/products/ProductForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import productService from '../../../services/product.service';
import API from '../../../services/api.service';
import LoadingSpinner from '../dashboard/LoadingSpinner';

export default function ProductForm({ vendorId: propVendorId, productId: propProductId }) {
  const navigate = useNavigate();
  const params = useParams();
  const vendorId = propVendorId || params.vendorId || propVendorId;
  const productId = propProductId || params.productId || propProductId;
  const fileInputRef = useRef(null);
  const isEditMode = !!productId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    sku: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    cost_price: '',
    quantity: '',
    low_stock_threshold: 5,
    weight: '',
    weight_unit: 'g',
    category_id: '',
    brand: '',
    tags: [],
    status: 'draft',
    is_featured: false,
    seo_title: '',
    seo_description: ''
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');

  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    loadCategories();
    if (isEditMode) {
      loadProduct();
    }
  }, [vendorId, productId]);

  const loadCategories = async () => {
    try {
      // Charger les catégories du vendeur
      const response = await API.get(`/products/vendors/${vendorId}/categories`);
      const payload = response.data || {};
      setCategories(Array.isArray(payload.categories) ? payload.categories : []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(vendorId, productId);
      const productData = response.data;
      
      setProduct({
        title: productData.title || '',
        sku: productData.sku || '',
        description: productData.description || '',
        short_description: productData.short_description || '',
        price: productData.price || '',
        compare_price: productData.compare_price || '',
        cost_price: productData.cost_price || '',
        quantity: productData.quantity || '',
        low_stock_threshold: productData.low_stock_threshold || 5,
        weight: productData.weight || '',
        weight_unit: productData.weight_unit || 'g',
        category_id: productData.category_id || '',
        brand: productData.brand || '',
        tags: productData.tags || [],
        status: productData.status || 'draft',
        is_featured: productData.is_featured || false,
        seo_title: productData.seo_title || '',
        seo_description: productData.seo_description || ''
      });

      setExistingImages(productData.images || []);
      
      // Trouver l'image principale
      const primary = productData.images?.find(img => img.is_primary);
      if (primary) {
        setPrimaryImageId(primary.id);
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Certains fichiers n\'ont pas été ajoutés. Formats acceptés: JPG, PNG, WEBP, GIF (max 5MB)');
    }

    setImages(prev => [...prev, ...validFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setDeletedImages(prev => [...prev, imageId]);
    
    if (primaryImageId === imageId) {
      setPrimaryImageId(existingImages.find(img => img.id !== imageId)?.id || null);
    }
  };

  const setAsPrimary = (imageId) => {
    setPrimaryImageId(imageId);
  };

  const buildSlug = (title) => {
    return (title || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!product.title.trim()) {
      newErrors.title = 'Le titre du produit est requis';
    }

    if (!product.price || parseFloat(product.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!product.quantity || parseInt(product.quantity) < 0) {
      newErrors.quantity = 'La quantité doit être un nombre positif';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setSaving(true);
      const normalizedSku = product.sku?.trim() || `PRD-${Date.now()}`;
      const normalizedSlug = buildSlug(product.title) || `product-${Date.now()}`;
      const productPayload = {
        ...product,
        sku: normalizedSku,
        slug: normalizedSlug,
        category_id: product.category_id || null
      };

      if (isEditMode) {
        await productService.updateProduct(
          vendorId,
          productId,
          {
            ...productPayload,
            primary_image_id: primaryImageId
          },
          images,
          deletedImages
        );
            } else {
        await productService.createProduct(
          vendorId,
          {
            ...productPayload,
            primary_image_index: 0 // Première image comme principale
          },
          images
        );
      }

      // Rediriger vers l'onglet Produits du dashboard
      navigate('/vendor/dashboard?tab=products', { replace: true });
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Modifiez les informations de votre produit' : 'Créez un nouveau produit dans votre catalogue'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>{isEditMode ? 'Mettre à jour' : 'Publier'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de base */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations générales</h3>
            
            <div className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du produit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: T-shirt en coton bio"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (référence)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Généré automatiquement si vide"
                />
              </div>

              {/* Description courte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description courte
                </label>
                <textarea
                  name="short_description"
                  value={product.short_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Brève description qui apparaît dans les listes de produits"
                />
              </div>

              {/* Description complète */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Description complète du produit, caractéristiques, avantages..."
                />
              </div>
            </div>
          </div>

          {/* Prix et stock */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Prix et stock</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de vente <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Prix barré */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix barré
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    name="compare_price"
                    value={product.compare_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Prix barré pour afficher une promotion
                </p>
              </div>

              {/* Coût */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de revient
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input
                    type="number"
                    name="cost_price"
                    value={product.cost_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité en stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                )}
              </div>

              {/* Seuil d'alerte stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil d'alerte stock
                </label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={product.low_stock_threshold}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="5"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Vous serez alerté quand le stock passe en dessous de ce nombre
                </p>
              </div>
            </div>
          </div>

          {/* Images du produit */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Images du produit</h3>
            
            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Images actuelles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        primaryImageId === image.id ? 'border-emerald-500' : 'border-gray-200'
                      }`}>
                        <img
                          src={resolveImageUrl(image.thumbnail_url || image.image_url)}
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        {primaryImageId !== image.id && (
                          <button
                            type="button"
                            onClick={() => setAsPrimary(image.id)}
                            className="p-1.5 bg-white rounded-full hover:bg-emerald-50 transition-colors"
                            title="Définir comme image principale"
                          >
                            <StarIcon className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="p-1.5 bg-white rounded-full hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                      
                      {primaryImageId === image.id && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles images */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Ajouter des images
              </h4>
              
              {/* Zone d'upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Cliquez pour ajouter des images
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, WEBP ou GIF (max. 5MB par image)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Prévisualisation des nouvelles images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Nouvelles images ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Nouvelle image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne latérale - 1/3 */}
        <div className="space-y-6">
          {/* Statut et visibilité */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Publication</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente de validation</option>
                  <option value="active">Publié</option>
                  <option value="inactive">Masqué</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={product.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                  Mettre en avant
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Les produits mis en avant apparaissent en priorité dans votre boutique
              </p>
            </div>
          </div>

          {/* Catégorie et marque */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Organisation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category_id"
                  value={product.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marque
                </label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ex: Nike, Apple, ..."
                />
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Livraison</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="weight"
                    value={product.weight}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <select
                    name="weight_unit"
                    value={product.weight_unit}
                    onChange={handleChange}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Référencement (SEO)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre SEO
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={product.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Titre pour les moteurs de recherche"
                  maxLength="60"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {product.seo_title?.length || 0}/60 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description SEO
                </label>
                <textarea
                  name="seo_description"
                  value={product.seo_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Description pour les moteurs de recherche"
                  maxLength="160"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {product.seo_description?.length || 0}/160 caractères
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}







