import { 
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  CogIcon,
  PlusCircleIcon 
} from "@heroicons/react/24/outline";

export default function MobileBottomNav({ activeTab, setActiveTab, navigate }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-4 py-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === "overview" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <ChartBarIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </button>
        
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === "orders" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <ShoppingCartIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Commandes</span>
        </button>
        
        <button
          onClick={() => navigate("/vendor/add-product")}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full -mt-6 shadow-lg"
        >
          <PlusCircleIcon className="h-7 w-7" />
        </button>
        
        <button
          onClick={() => setActiveTab("products")}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === "products" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <CubeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Produits</span>
        </button>
        
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === "settings" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <CogIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
}