import { useNavigate } from "react-router-dom";

export default function PopularProducts({ products }) {
  const navigate = useNavigate();

  const getStockBadge = (stock) => {
    if (stock > 10) {
      return 'bg-green-100 text-green-800';
    } else if (stock > 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Produits populaires</h3>
        <button 
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          onClick={() => navigate("/vendor/products")}
        >
          Voir tout →
        </button>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/vendor/products/${product.id}`)}
          >
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">{product.sales} ventes</span>
                <span className="text-sm font-medium text-emerald-600">{product.revenue}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStockBadge(product.stock)}`}>
              Stock: {product.stock}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}