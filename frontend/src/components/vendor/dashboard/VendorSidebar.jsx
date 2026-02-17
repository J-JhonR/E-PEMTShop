import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

export default function VendorSidebar({ activeTab, setActiveTab, vendorData, handleLogout }) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <BuildingStorefrontIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              PEMT<span className="text-emerald-600">Shop</span>
            </span>
          </Link>
        </div>

        {/* Info vendeur */}
        <div className="px-6 mb-6">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {vendorData?.business_name || "Ma Boutique"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Vendeur #{vendorData?.vendor_id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChartBarIcon className="mr-3 h-5 w-5" />
            Vue d'ensemble
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ShoppingCartIcon className="mr-3 h-5 w-5" />
            Commandes
            <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "products"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CubeIcon className="mr-3 h-5 w-5" />
            Produits
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChartBarIcon className="mr-3 h-5 w-5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "customers"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UserGroupIcon className="mr-3 h-5 w-5" />
            Clients
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === "messages"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChatBubbleLeftRightIcon className="mr-3 h-5 w-5" />
            Messages
            <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              5
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CogIcon className="mr-3 h-5 w-5" />
              Paramètres
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}