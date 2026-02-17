// components/vendor/products/ProductList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CubeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import productService from '../../../services/product.service';
import LoadingSpinner from '../dashboard/LoadingSpinner';

export default function ProductList({ vendorId }) {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');
  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const defaultPagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(defaultPagination);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    loadProducts();
  }, [vendorId, pagination.page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getVendorProducts(vendorId, {
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        status: filters.status,
        search: filters.search
      });

      const productsData = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.products)
          ? response.products
          : [];

      const responsePagination = response?.pagination && typeof response.pagination === 'object'
        ? response.pagination
        : {
            page: pagination?.page || 1,
            limit: pagination?.limit || 10,
            total: productsData.length,
            pages: 1
          };

      setProducts(productsData);
      setPagination((prev) => ({ ...defaultPagination, ...prev, ...responsePagination }));
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts([]);
      setPagination(defaultPagination);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(vendorId, productId);
        loadProducts();
      } catch (error) {
        console.error('Erreur suppression produit:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactif' },
      out_of_stock: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Rupture' }
    };
    
    const { bg, text, label } = config[status] || config.draft;
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>{label}</span>;
  };

  const getStockBadge = (quantity, threshold) => {
    if (quantity <= 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rupture</span>;
    } else if (quantity <= threshold) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Stock faible</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{quantity} en stock</span>;
    }
  };

  if (loading) return <LoadingSpinner />;
  const safePagination = pagination || defaultPagination;

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      {/* Header avec actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
            <p className="text-sm text-gray-500 mt-1">
              {safePagination.total} produit{safePagination.total > 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => navigate(`/vendor/dashboard?tab=products&action=add`)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Ajouter un produit</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par titre ou SKU..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactif</option>
              <option value="out_of_stock">Rupture</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ventes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                  <button
                    onClick={() => navigate('/vendor/dashboard?tab=products&action=add')}
                    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Ajouter votre premier produit
                  </button>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.primary_image ? (
                          <img
                            src={resolveImageUrl(product.primary_image)}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <CubeIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                        {product.low_stock_threshold && product.quantity <= product.low_stock_threshold && product.quantity > 0 && (
                          <div className="flex items-center mt-1 text-xs text-orange-600">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Stock faible
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                    {product.compare_price && (
                      <div className="text-xs text-gray-500 line-through">
                        {product.compare_price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockBadge(product.quantity, product.low_stock_threshold || 5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.total_sales || 0} ventes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/vendor/dashboard?tab=products&action=edit&productId=${product.id}`)}
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        title="Visualiser"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/vendor/dashboard?tab=products&action=edit&productId=${product.id}`)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {safePagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {safePagination.page} sur {safePagination.pages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination({ ...safePagination, page: safePagination.page - 1 })}
                disabled={safePagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination({ ...safePagination, page: safePagination.page + 1 })}
                disabled={safePagination.page === safePagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
