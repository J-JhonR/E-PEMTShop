import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PlusCircleIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import ProductList from '../../components/vendor/products/ProductList';
import ProductForm from '../../components/vendor/products/ProductForm';
import OrderList from '../../components/vendor/orders/OrderList';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [productFormMode, setProductFormMode] = useState(null); // null | 'add' | 'edit'
  const [productToEditId, setProductToEditId] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", message: "Nouvelle commande #ORD-78945", time: "5 min", read: false },
    { id: 2, type: "stock", message: "Stock faible pour 'T-shirt Basic'", time: "2h", read: false },
    { id: 3, type: "payment", message: "Paiement reçu: 450,00 €", time: "1j", read: true },
  ]);

  const location = useLocation();

  useEffect(() => {
    const storedData = localStorage.getItem("vendorData");
    const token = localStorage.getItem("token");

    if (!token || !storedData) {
      navigate("/auth/login-vendor", { replace: true });
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setVendorData(data);

      // Parse query params to set active tab / product form mode
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab');
      const action = params.get('action');
      const pid = params.get('productId');

      if (tabParam) setActiveTab(tabParam);
      if (action === 'add') {
        setProductFormMode('add');
        setProductToEditId(null);
      } else if (action === 'edit') {
        setProductFormMode('edit');
        setProductToEditId(pid || null);
      } else {
        setProductFormMode(null);
        setProductToEditId(null);
      }

      // Simuler le chargement des données du dashboard
      setTimeout(() => {
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error("Erreur de chargement des données:", error);
      navigate("/auth/login-vendor", { replace: true });
    }
  }, [navigate, location.search]);

  const vendorId = vendorData?.vendor?.id || vendorData?.user?.id || vendorData?.id || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("vendorData");
    
    // 🔒 Sécurité : Empêcher la navigation arrière après logout
    window.history.replaceState(null, "", "/auth/login-vendor");
    
    navigate("/auth/login-vendor", { replace: true });
  };

  // Statistiques du dashboard
  const stats = [
    { 
      title: "Chiffre d'affaires", 
      value: "12 450,00 €", 
      change: "+15%", 
      isPositive: true,
      icon: CurrencyDollarIcon,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Commandes", 
      value: "145", 
      change: "+8%", 
      isPositive: true,
      icon: ShoppingCartIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Produits", 
      value: "89", 
      change: "+12%", 
      isPositive: true,
      icon: CubeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      title: "Clients", 
      value: "1 234", 
      change: "+5%", 
      isPositive: true,
      icon: UserGroupIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      title: "Note moyenne", 
      value: "4.7/5", 
      change: "+0.2", 
      isPositive: true,
      icon: StarIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      title: "Conversion", 
      value: "3.2%", 
      change: "-0.5%", 
      isPositive: false,
      icon: ChartBarIcon,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
  ];

  // Commandes récentes
  const recentOrders = [
    { id: "#ORD-78945", customer: "Marie Dupont", amount: "89,90 €", status: "paid", date: "10 min" },
    { id: "#ORD-78944", customer: "Jean Martin", amount: "145,50 €", status: "shipped", date: "2h" },
    { id: "#ORD-78943", customer: "Sophie Leroy", amount: "56,00 €", status: "processing", date: "5h" },
    { id: "#ORD-78942", customer: "Paul Bernard", amount: "230,00 €", status: "delivered", date: "1j" },
    { id: "#ORD-78941", customer: "Lisa Petit", amount: "45,90 €", status: "cancelled", date: "2j" },
  ];

  // Produits populaires
  const popularProducts = [
    { name: "T-shirt Basic", sales: 45, revenue: "1 350,00 €", stock: 12 },
    { name: "Casque Audio Pro", sales: 28, revenue: "2 240,00 €", stock: 8 },
    { name: "Montre Connectée", sales: 32, revenue: "3 200,00 €", stock: 5 },
    { name: "Sac à dos Urbain", sales: 19, revenue: "855,00 €", stock: 15 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation pour vendeur */}
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
                    {vendorData?.vendor?.businessName || "Ma Boutique"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {vendorData?.vendor?.address || "Adresse non renseignée"}
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

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "overview" && "Tableau de bord"}
                {activeTab === "orders" && "Commandes"}
                {activeTab === "products" && "Produits"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "customers" && "Clients"}
                {activeTab === "messages" && "Messages"}
                {activeTab === "settings" && "Paramètres"}
              </h1>
              <p className="text-sm text-gray-500">
                {vendorData?.vendor?.businessName || "Ma Boutique"} • {vendorData?.vendor?.address || "Adresse"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <BellIcon className="h-6 w-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Bouton Ajouter produit */}
              <button onClick={() => navigate(`/vendor/dashboard?tab=products&action=add`)} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-300">
                <PlusCircleIcon className="h-5 w-5" />
                <span>Ajouter produit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="py-6">
          <div className="px-6">
            {/* Vue d'ensemble */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Vendor Business Info Card */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl border border-emerald-400 p-8 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {vendorData?.vendor?.businessName || "Ma Boutique"}
                      </h2>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center space-x-2 text-emerald-50">
                          <BuildingStorefrontIcon className="h-5 w-5" />
                          <span>{vendorData?.vendor?.businessType || "Type non renseigné"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-emerald-50">
                          <MapPinIcon className="h-5 w-5" />
                          <span>
                            {vendorData?.vendor?.address || "Adresse non renseignée"}
                            {vendorData?.vendor?.city && `, ${vendorData.vendor.city}`}
                            {vendorData?.vendor?.postalCode && ` ${vendorData.vendor.postalCode}`}
                          </span>
                        </div>
                        {vendorData?.vendor?.country && (
                          <div className="flex items-center space-x-2 text-emerald-50">
                            <GlobeAltIcon className="h-5 w-5" />
                            <span>{vendorData.vendor.country}</span>
                          </div>
                        )}
                      </div>
                      {vendorData?.vendor?.website && (
                        <a 
                          href={vendorData.vendor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                        >
                          <GlobeAltIcon className="h-4 w-4" />
                          <span>Visiter le site</span>
                        </a>
                      )}
                    </div>
                    <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl">
                      <BuildingStorefrontIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stat.isPositive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {stat.isPositive ? (
                            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                          )}
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                    </div>
                  ))}
                </div>

                {/* Charts & Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Commandes récentes */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
                      <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
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
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4">
                                <span className="font-medium text-gray-900">{order.id}</span>
                              </td>
                              <td className="py-4">{order.customer}</td>
                              <td className="py-4 font-medium">{order.amount}</td>
                              <td className="py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status === 'paid' && 'Payé'}
                                  {order.status === 'shipped' && 'Expédié'}
                                  {order.status === 'processing' && 'En traitement'}
                                  {order.status === 'delivered' && 'Livré'}
                                  {order.status === 'cancelled' && 'Annulé'}
                                </span>
                              </td>
                              <td className="py-4 text-sm text-gray-500">{order.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Produits populaires */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Produits populaires</h3>
                      <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        Voir tout →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {popularProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div>
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{product.sales} ventes</span>
                              <span className="text-sm font-medium text-emerald-600">{product.revenue}</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : product.stock > 5 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            Stock: {product.stock}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <PlusCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Ajouter produit</span>
                  </button>
                  
                  <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <EyeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Voir boutique</span>
                  </button>
                  
                  <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ChartBarIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900">Rapports</span>
                  </button>
                  
                  <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-red-300 hover:bg-red-50 transition-all duration-300">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CogIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">Paramètres</span>
                  </button>
                </div>
              </div>
            )}

            {/* Autres onglets (exemple pour Commandes) */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {vendorId ? (
                  <OrderList vendorId={vendorId} />
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des commandes</h2>
                    <p className="text-gray-500">
                      Impossible de charger les commandes: identifiant vendeur manquant.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6">
                {productFormMode ? (
                  <ProductForm vendorId={vendorId} productId={productToEditId} />
                ) : (
                  <ProductList vendorId={vendorId} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
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
            onClick={() => navigate(`/vendor/dashboard?tab=products&action=add`)}
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
    </div>
  );
}
