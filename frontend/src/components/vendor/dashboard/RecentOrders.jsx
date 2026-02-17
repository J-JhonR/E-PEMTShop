import { useNavigate } from "react-router-dom";

export default function RecentOrders({ orders }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const config = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Payé' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Expédié' },
      processing: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En traitement' },
      delivered: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Livré' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' }
    };
    
    const { bg, text, label } = config[status] || config.cancelled;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
        <button 
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          onClick={() => navigate("/vendor/orders")}
        >
          Voir tout →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Commande</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Client</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Montant</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Statut</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="py-4">
                  <span className="font-medium text-gray-900">{order.id}</span>
                </td>
                <td className="py-4">{order.customer}</td>
                <td className="py-4 font-medium">{order.amount}</td>
                <td className="py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-4 text-sm text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}