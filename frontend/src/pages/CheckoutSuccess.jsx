import { Link, useLocation } from 'react-router-dom';

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'SIM-UNKNOWN';
  const orderNumbers = Array.isArray(location.state?.orderNumbers) ? location.state.orderNumbers : [];
  const amount = Number(location.state?.amount || 0);
  const cardLast4 = location.state?.cardLast4 || '0000';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
          ?
        </div>
        <h1 className="text-2xl font-bold mb-2">Paiement valide (simulation)</h1>
        <p className="text-gray-600 mb-6">
          Commande {orderId} confirmee pour {amount.toFixed(2)} avec la carte **** {cardLast4}.
        </p>

        {orderNumbers.length > 1 ? (
          <div className="mb-6 text-sm text-gray-600">
            <p className="font-medium mb-2">References de commandes:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {orderNumbers.map((n) => (
                <span key={n} className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200">
                  {n}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex justify-center gap-3">
          <Link to="/products" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
            Continuer les achats
          </Link>
          <Link to="/" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
            Retour accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
