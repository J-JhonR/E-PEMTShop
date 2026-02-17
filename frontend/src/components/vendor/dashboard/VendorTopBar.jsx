import { BellIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function VendorTopBar({ activeTab, vendorData, setActiveTab }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", message: "Nouvelle commande #ORD-78945", time: "5 min", read: false },
    { id: 2, type: "stock", message: "Stock faible pour 'T-shirt Basic'", time: "2h", read: false },
    { id: 3, type: "payment", message: "Paiement reçu: 450,00 €", time: "1j", read: true },
  ]);

  const getTabTitle = (tab) => {
    const titles = {
      overview: "Tableau de bord",
      orders: "Commandes",
      products: "Produits",
      analytics: "Analytics",
      customers: "Clients",
      messages: "Messages",
      settings: "Paramètres"
    };
    return titles[tab] || "Tableau de bord";
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-sm text-gray-500">
            {vendorData?.business_name} • Vendeur #{vendorData?.vendor_id}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              onClick={() => setActiveTab("notifications")}
            >
              <BellIcon className="h-6 w-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Bouton Ajouter produit */}
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
            onClick={() => setActiveTab("add-product")}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Ajouter produit</span>
          </button>
        </div>
      </div>
    </div>
  );
}