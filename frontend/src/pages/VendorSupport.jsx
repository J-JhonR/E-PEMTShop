import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "../components/vendor/dashboard/VendorSidebar";
import VendorTopBar from "../components/vendor/dashboard/VendorTopBar";
import StatsCards from "../components/vendor/dashboard/StatsCards";
import RecentOrders from "../components/vendor/dashboard/RecentOrders";
import PopularProducts from "../components/vendor/dashboard/PopularProducts";
import QuickActions from "../components/vendor/dashboard/QuickActions";
import LoadingSpinner from "../components/vendor/dashboard/LoadingSpinner";
import MobileBottomNav from "../components/vendor/dashboard/MobileBottomNav";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("vendorData");
    const token = localStorage.getItem("token");
    
    if (!token || !storedData) {
      navigate("/auth/login-vendor");
      return;
    }
    
    try {
      const data = JSON.parse(storedData);
      setVendorData(data);
      
      // Charger les données du dashboard depuis l'API
      loadDashboardData(data.id);
      
    } catch (error) {
      console.error("Erreur de chargement des données:", error);
      navigate("/auth/login-vendor");
    }
  }, [navigate]);

  const loadDashboardData = async (vendorId) => {
    try {
      // Appels API pour récupérer les données réelles
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch(`/api/vendors/${vendorId}/dashboard/stats`),
        fetch(`/api/vendors/${vendorId}/orders/recent`),
        fetch(`/api/vendors/${vendorId}/products/popular`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setRecentOrders(await ordersRes.json());
      if (productsRes.ok) setPopularProducts(await productsRes.json());

    } catch (error) {
      console.error("Erreur chargement données:", error);
      // Données par défaut si API échoue
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultData = () => {
    // Données par défaut
    setStats([
      { 
        title: "Chiffre d'affaires", 
        value: "12 450,00 €", 
        change: "+15%", 
        isPositive: true,
        icon: "CurrencyDollarIcon",
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      { 
        title: "Commandes", 
        value: "145", 
        change: "+8%", 
        isPositive: true,
        icon: "ShoppingCartIcon",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      { 
        title: "Produits", 
        value: "89", 
        change: "+12%", 
        isPositive: true,
        icon: "CubeIcon",
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      { 
        title: "Clients", 
        value: "1 234", 
        change: "+5%", 
        isPositive: true,
        icon: "UserGroupIcon",
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      { 
        title: "Note moyenne", 
        value: "4.7/5", 
        change: "+0.2", 
        isPositive: true,
        icon: "StarIcon",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      },
      { 
        title: "Conversion", 
        value: "3.2%", 
        change: "-0.5%", 
        isPositive: false,
        icon: "ChartBarIcon",
        color: "text-red-600",
        bgColor: "bg-red-50"
      },
    ]);

    setRecentOrders([
      { id: "#ORD-78945", customer: "Marie Dupont", amount: "89,90 €", status: "paid", date: "10 min" },
      { id: "#ORD-78944", customer: "Jean Martin", amount: "145,50 €", status: "shipped", date: "2h" },
      { id: "#ORD-78943", customer: "Sophie Leroy", amount: "56,00 €", status: "processing", date: "5h" },
      { id: "#ORD-78942", customer: "Paul Bernard", amount: "230,00 €", status: "delivered", date: "1j" },
      { id: "#ORD-78941", customer: "Lisa Petit", amount: "45,90 €", status: "cancelled", date: "2j" },
    ]);

    setPopularProducts([
      { name: "T-shirt Basic", sales: 45, revenue: "1 350,00 €", stock: 12 },
      { name: "Casque Audio Pro", sales: 28, revenue: "2 240,00 €", stock: 8 },
      { name: "Montre Connectée", sales: 32, revenue: "3 200,00 €", stock: 5 },
      { name: "Sac à dos Urbain", sales: 19, revenue: "855,00 €", stock: 15 },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("vendorData");
    navigate("/auth/login-vendor");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vendorData={vendorData}
        handleLogout={handleLogout}
      />
      
      <div className="lg:pl-64">
        <VendorTopBar 
          activeTab={activeTab}
          vendorData={vendorData}
          setActiveTab={setActiveTab}
        />
        
        <main className="py-6">
          <div className="px-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <StatsCards stats={stats} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RecentOrders orders={recentOrders} />
                  </div>
                  <div>
                    <PopularProducts products={popularProducts} />
                  </div>
                </div>
                
                <QuickActions setActiveTab={setActiveTab} />
              </div>
            )}
            
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des commandes</h2>
                <p>Contenu des commandes...</p>
              </div>
            )}
            
            {activeTab === "products" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des produits</h2>
                <p>Contenu des produits...</p>
              </div>
            )}
            
            {/* Ajouter d'autres onglets ici */}
          </div>
        </main>
      </div>
      
      <MobileBottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
}