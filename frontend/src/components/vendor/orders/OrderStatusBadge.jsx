export default function OrderStatusBadge({ status }) {
  const config = {
    pending: { label: 'En attente', classes: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmée', classes: 'bg-blue-100 text-blue-800' },
    processing: { label: 'En traitement', classes: 'bg-indigo-100 text-indigo-800' },
    shipped: { label: 'Expédiée', classes: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Livrée', classes: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Annulée', classes: 'bg-red-100 text-red-800' },
    refunded: { label: 'Remboursée', classes: 'bg-gray-100 text-gray-800' }
  };

  const current = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${current.classes}`}>
      {current.label}
    </span>
  );
}

