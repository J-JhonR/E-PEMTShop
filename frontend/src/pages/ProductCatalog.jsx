import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import publicService from '../services/public.service';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');
  
  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sortBy: searchParams.get('sortBy') || 'newest',
      page: Number(searchParams.get('page') || 1),
      limit: 12
    }),
    [searchParams]
  );

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        const response = await publicService.getCategories();
        if (!mounted) return;
        setCategories(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        if (!mounted) return;
        setCategories([]);
      }
    };

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicService.getProducts(filters);
        if (!mounted) return;
        setProducts(response.data || []);
        setPagination(response.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      } catch (err) {
        if (!mounted) return;
        setError('Impossible de charger les produits.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [filters]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-900 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl font-bold mb-4">Notre Collection</h1>
            <p className="text-xl text-emerald-100 max-w-2xl">
              Découvrez une sélection unique de produits soigneusement choisis pour vous
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtres */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="mb-10"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilter('search', e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilter('search', '')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative min-w-[200px]">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilter('sortBy', e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price_asc">Prix: Croissant</option>
                  <option value="price_desc">Prix: Décroissant</option>
                  <option value="popular">Les plus populaires</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Catégories */}
            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('category', '')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    !filters.category ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Toutes catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter('category', String(category.id))}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      String(filters.category) === String(category.id)
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} {category.product_count ? `(${category.product_count})` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-700 rounded-full animate-pulse"></div>
              </div>
              <p className="text-center mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <p className="text-red-600 text-lg">{error}</p>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {products.map((product) => (
                    <motion.div 
                      key={product.id} 
                      variants={itemVariants} 
                      whileHover={{ y: -8 }} 
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <Link to={`/products/${product.slug}`} className="block">
                          <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                            {product.primary_image ? (
                              <>
                                <img
                                  src={resolveImageUrl(product.primary_image)}
                                  alt={product.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-sm">Aucune image</span>
                              </div>
                            )}
                            
                            {/* Badge promo */}
                            {product.compare_price && product.compare_price > product.price && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                              </div>
                            )}
                            
                            {/* Badge aperçu */}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              Voir détails
                            </div>
                          </div>
                        </Link>

                        <div className="p-5 flex-1 flex flex-col">
                          {/* Catégorie */}
                          {product.category_name && (
                            <span className="inline-block mb-2 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 self-start">
                              {product.category_name}
                            </span>
                          )}

                          {/* Titre */}
                          <Link to={`/products/${product.slug}`} className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                              {product.title}
                            </h3>
                          </Link>

                          {/* Prix */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-2xl font-bold text-green-700">
                                {Number(product.price || 0).toFixed(2)} €
                              </span>
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="ml-2 text-sm text-gray-400 line-through">
                                  {Number(product.compare_price).toFixed(2)} €
                                </span>
                              )}
                            </div>

                            {/* Stock faible */}
                            {product.quantity <= 5 && product.quantity > 0 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full whitespace-nowrap">
                                Plus que {product.quantity}
                              </span>
                            )}
                            
                            {/* Rupture de stock */}
                            {product.quantity <= 0 && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap">
                                Rupture
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex gap-2">
                            <Link
                              to={`/products/${product.slug}`}
                              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Voir
                            </Link>
                            <button
                              type="button"
                              onClick={() => addToCart(product, 1)}
                              disabled={product.quantity <= 0}
                              className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                product.quantity <= 0
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-green-700 to-emerald-700 text-white hover:from-green-800 hover:to-emerald-800'
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Acheter
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.5 }} 
                    className="flex flex-wrap justify-center items-center gap-2 mt-12"
                  >
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        pagination.page <= 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-sm'
                      }`}
                      disabled={pagination.page <= 1}
                      onClick={() => setFilter('page', String(pagination.page - 1))}
                      aria-label="Page précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="hidden sm:inline">Précédent</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setFilter('page', String(pageNum))}
                            className={`w-10 h-10 rounded-xl font-medium transition-all ${
                              pagination.page === pageNum
                                ? 'bg-green-700 text-white shadow-lg shadow-green-200'
                                : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pagination.page === pageNum ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        pagination.page >= pagination.pages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 shadow-sm'
                      }`}
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => setFilter('page', String(pagination.page + 1))}
                      aria-label="Page suivante"
                    >
                      <span className="hidden sm:inline">Suivant</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* Compteur de produits */}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center mt-6 text-sm text-gray-500"
                >
                  {pagination.total} produit{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}