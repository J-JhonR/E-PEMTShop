// src/components/Navbar.jsx
import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  CogIcon,
  GiftIcon,
  ChartBarIcon,
  TruckIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { forwardRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// ========== CONSTANTES ==========
const CATEGORIES = [
  {
    id: 1,
    name: "Mode & Accessoires",
    icon: GiftIcon,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    subcategories: ["Vêtements Homme", "Vêtements Femme", "Chaussures", "Sacs & Bagagerie", "Montres & Bijoux"]
  },
  {
    id: 2,
    name: "Électronique",
    icon: ChartBarIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    subcategories: ["Smartphones", "Ordinateurs", "TV & Audio", "Gaming", "Accessoires"]
  },
  {
    id: 3,
    name: "Maison & Jardin",
    icon: BuildingStorefrontIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    subcategories: ["Mobilier", "Décoration", "Cuisine", "Jardinage", "Bricolage"]
  },
  {
    id: 4,
    name: "Beauté & Santé",
    icon: HeartIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    subcategories: ["Cosmétiques", "Parfums", "Soins visage", "Soins corps", "Santé"]
  },
  {
    id: 5,
    name: "Sport & Loisirs",
    icon: UserGroupIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    subcategories: ["Vêtements sport", "Équipement", "Randonnée", "Fitness", "Vélos"]
  }
];

// ========== SOUS-COMPOSANTS ==========

// Logo
const Logo = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="text-2xl font-bold text-gray-900">
        PEMT<span className="text-green-700">Shop</span>
        <span className="text-xs font-normal text-gray-500 ml-2">Marketplace</span>
      </div>
    </button>
  );
};

// InfoBar (livraison & paiement)
const InfoBar = () => (
  <div className="hidden lg:flex items-center gap-8">
    <div className="flex items-center gap-6 text-sm text-gray-600">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
          <TruckIcon className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Livraison offerte</p>
          <p className="text-xs text-gray-500">Dès 50€ d'achat</p>
        </div>
      </div>
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
          <ShieldCheckIcon className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Paiement sécurisé</p>
          <p className="text-xs text-gray-500">100% sécurisé</p>
        </div>
      </div>
    </div>
  </div>
);

// CategoriesDropdown
const CategoriesDropdown = ({ isOpen, onMouseEnter, onMouseLeave }) => (
  <div className="relative group hidden md:block" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <button className="flex items-center gap-3 bg-gradient-to-r from-green-700 to-green-800 text-white px-5 py-3 rounded-xl hover:from-green-800 hover:to-green-900 transition-all duration-300 shadow-md hover:shadow-lg">
      <Bars3Icon className="w-5 h-5" />
      <span className="font-semibold">Toutes catégories</span>
      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && <CategoriesMegaMenu />}
  </div>
);

// CategoriesMegaMenu
const CategoriesMegaMenu = () => (
  <div className="absolute left-0 mt-2 w-[900px] bg-white border rounded-2xl shadow-2xl z-50 animate-fadeIn">
    <div className="p-6">
      <div className="grid grid-cols-5 gap-6">
        {CATEGORIES.map((category) => (
          <CategoryColumn key={category.id} category={category} />
        ))}
      </div>
      <PromoBanner />
    </div>
  </div>
);

const CategoryColumn = ({ category }) => (
  <div className="group/category">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 ${category.bgColor} rounded-xl group-hover/category:scale-110 transition-transform`}>
        <category.icon className={`h-6 w-6 ${category.color}`} />
      </div>
      <h4 className="font-bold text-gray-900 group-hover/category:text-green-700 transition-colors">
        {category.name}
      </h4>
    </div>
    <ul className="space-y-2">
      {category.subcategories.map((sub, index) => (
        <li key={index} className="text-gray-600 hover:text-green-700 cursor-pointer py-2 px-3 rounded-lg hover:bg-green-50 transition-all group-hover/category:translate-x-1 duration-200">
          <div className="flex items-center justify-between">
            <span>{sub}</span>
            <ChevronDownIcon className="w-4 h-4 opacity-0 group-hover/category:opacity-100 rotate-90" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const PromoBanner = () => (
  <div className="mt-8 pt-6 border-t">
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-900">Promotions du moment</h4>
          <p className="text-sm text-gray-600">Jusqu'à -70% sur une sélection de produits</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Voir les offres
        </button>
      </div>
    </div>
  </div>
);

// SearchBar
const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className="flex-1 relative">
    <form onSubmit={handleSearch} className="flex gap-2">
      <select className="hidden lg:block border border-r-0 rounded-l-full px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
        <option>Toutes catégories</option>
        {CATEGORIES.map(cat => <option key={cat.id}>{cat.name}</option>)}
      </select>
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un produit, une marque ou un vendeur..."
          className="w-full border rounded-full lg:rounded-l-none lg:rounded-r-full pl-12 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button type="submit" className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
            Rechercher
          </button>
        </div>
      </div>
    </form>
  </div>
);

// CartButton
const CartButton = ({ cartCount, subtotal, navigate }) => (
  <button onClick={() => navigate("/cart")} className="relative flex items-center gap-2 text-gray-700 hover:text-green-700 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group/cart">
    <div className="relative">
      <div className="p-2 bg-gray-100 rounded-lg group-hover/cart:bg-green-50 group-hover/cart:scale-110 transition-all">
        <ShoppingCartIcon className="h-5 w-5 group-hover/cart:text-green-700 transition-colors" />
      </div>
      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-700 to-green-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {cartCount}
      </span>
    </div>
    <div className="hidden sm:block text-left">
      <span className="text-sm font-medium block">Panier</span>
      <span className="text-xs text-gray-500">{Number(subtotal || 0).toFixed(2)} €</span>
    </div>
  </button>
);

// ========== COMPOSANT PRINCIPAL ==========
export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, subtotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const accountDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target)) {
        setIsCategoriesDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}&page=1`);
      setSearchQuery("");
      return;
    }
    navigate('/products');
  };

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeAllMenus = useCallback(() => {
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  const navigationHandlers = {
    loginClient: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/auth/login-client"); }, [navigate, closeAllMenus]),
    registerClient: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/auth/register-client"); }, [navigate, closeAllMenus]),
    loginVendor: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/auth/login-vendor"); }, [navigate, closeAllMenus]),
    registerVendor: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/auth/register-vendor"); }, [navigate, closeAllMenus]),
    profile: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate(user?.role === "client" ? "/profile" : "/vendor/dashboard"); }, [navigate, closeAllMenus, user]),
    clientOverview: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/profile?tab=overview"); }, [navigate, closeAllMenus]),
    clientOrders: useCallback((e) => { e?.preventDefault?.(); closeAllMenus(); navigate("/profile?tab=orders"); }, [navigate, closeAllMenus]),
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || user?.email || "Mon compte";
  const isClient = user?.role === "client";
  const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
  const normalizedAvatarUrl = user?.avatarUrl
    ? (String(user.avatarUrl).startsWith('http') ? user.avatarUrl : `${backendOrigin}${user.avatarUrl}`)
    : null;

  return (
    <header className={`sticky top-0 z-50 bg-white border-b shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-2">
          <Logo />
          <InfoBar />
          <button className="lg:hidden mobile-menu-button p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6 text-gray-700" /> : <Bars3Icon className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center gap-4 pb-2">
          <CategoriesDropdown 
            isOpen={isCategoriesDropdownOpen}
            onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
            onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
          />
          
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

          <div className="flex items-center gap-3">
            <AccountDropdown 
              ref={accountDropdownRef}
              isOpen={isAccountDropdownOpen}
              onMouseEnter={() => setIsAccountDropdownOpen(true)}
              onMouseLeave={() => setIsAccountDropdownOpen(false)}
              isAuthenticated={isAuthenticated}
              user={{ ...(user || {}), avatarUrl: normalizedAvatarUrl }}
              displayName={displayName}
              isClient={isClient}
              handlers={navigationHandlers}
              onLogout={handleLogout}
            />
            
            <CartButton cartCount={cartCount} subtotal={subtotal} navigate={navigate} />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu 
            ref={mobileMenuRef}
            isAuthenticated={isAuthenticated}
            isClient={isClient}
            handlers={navigationHandlers}
            onLogout={handleLogout}
            onClose={() => setIsMobileMenuOpen(false)}
            navigate={navigate}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </header>
  );
}

// ========== COMPOSANTS COMPLEXES ==========

// AccountDropdown (avec forwardRef)
const AccountDropdown = forwardRef(({ isOpen, onMouseEnter, onMouseLeave, isAuthenticated, user, displayName, isClient, handlers, onLogout }, ref) => (
  <div className="relative" ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <AccountButton isAuthenticated={isAuthenticated} displayName={displayName} isOpen={isOpen} avatarUrl={user?.avatarUrl} />
    
    {isOpen && (
      <div className="absolute right-0 mt-2 w-[600px] bg-white border rounded-2xl shadow-2xl z-50 animate-fadeIn">
        <div className="p-6">
          <AccountHeader isAuthenticated={isAuthenticated} user={user} />
          
          {isAuthenticated ? (
            <AuthenticatedContent 
              user={user}
              displayName={displayName}
              isClient={isClient}
              handlers={handlers}
              onLogout={onLogout}
            />
          ) : (
            <UnauthenticatedContent handlers={handlers} />
          )}
          
          <StatsSection />
        </div>
      </div>
    )}
  </div>
));

const AccountButton = ({ isAuthenticated, displayName, isOpen, avatarUrl }) => (
  <button className="flex items-center gap-2 text-gray-700 hover:text-green-700 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group/account">
    <div className="relative">
      <div className="p-2 bg-gray-100 rounded-lg group-hover/account:bg-green-50 group-hover/account:scale-110 transition-all">
        {isAuthenticated ? (
          avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="h-5 w-5 rounded-full object-cover" />
          ) : (
            <UserCircleIcon className="h-5 w-5 text-green-700" />
          )
        ) : (
          <UserIcon className="h-5 w-5 group-hover/account:text-green-700 transition-colors" />
        )}
      </div>
      {isAuthenticated && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
    </div>
    <div className="hidden sm:block text-left">
      <span className="text-sm font-medium block">{isAuthenticated ? displayName : "Mon compte"}</span>
      <span className="text-xs text-gray-500">{isAuthenticated ? "Connecté" : "Connectez-vous"}</span>
    </div>
    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const AccountHeader = ({ isAuthenticated, user }) => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl mb-4">
      {isAuthenticated ? (
        user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="avatar" className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-green-700" />
        )
      ) : (
        <UserGroupIcon className="h-8 w-8 text-green-700" />
      )}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      {isAuthenticated ? `Bonjour, ${user?.firstName || 'Client'} !` : "Bienvenue sur PEMTShop"}
    </h3>
    <p className="text-sm text-gray-600">
      {isAuthenticated ? `Connecté en tant que ${user?.role === 'client' ? 'client' : 'vendeur'}` : "Rejoignez notre communauté de 500 000 membres"}
    </p>
  </div>
);

const AuthenticatedContent = ({ user, displayName, isClient, handlers, onLogout }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-br from-green-50/50 to-white border border-green-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-6 w-6 text-green-700" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{displayName}</h4>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          user?.role === 'client' ? 'bg-green-100 text-green-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {user?.role === 'client' ? 'Client' : 'Vendeur'}
        </span>
      </div>
    </div>

    <div className="space-y-3">
      <button onClick={handlers.profile} className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
        Voir mon profil
      </button>

      {isClient && (
        <>
          <button onClick={handlers.clientOverview} className="w-full border border-green-200 text-green-700 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200">
            Dashboard client
          </button>
          <button onClick={handlers.clientOrders} className="w-full border border-green-200 text-green-700 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200">
            Historique des achats
          </button>
        </>
      )}
      
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200">
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        <span className="font-medium">Déconnexion</span>
      </button>
    </div>
  </div>
);

const UnauthenticatedContent = ({ handlers }) => (
  <div className="grid grid-cols-2 gap-6">
    <ClientSection handlers={handlers} />
    <VendorSection handlers={handlers} />
  </div>
);

const ClientSection = ({ handlers }) => (
  <div className="bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-blue-100 rounded-xl"><UserGroupIcon className="h-8 w-8 text-blue-700" /></div>
      <div>
        <h4 className="font-bold text-lg text-gray-900">Espace Client</h4>
        <p className="text-sm text-gray-500">Achetez en toute confiance</p>
      </div>
    </div>

    <div className="space-y-4">
      <button onClick={handlers.loginClient} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
        Se connecter
      </button>
      <p className="text-sm text-center">
        Nouveau client ?{" "}
        <span onClick={handlers.registerClient} className="text-blue-700 font-semibold cursor-pointer hover:underline">
          Créer un compte
        </span>
      </p>
    </div>

    <ClientFeatures />
  </div>
);

const ClientFeatures = () => {
  const features = [
    { icon: HeartIcon, label: "Liste d'envies" },
    { icon: ClockIcon, label: "Historique" },
    { icon: TruckIcon, label: "Suivi commandes" },
    { icon: CogIcon, label: "Paramètres" }
  ];
  
  return (
    <div className="mt-6 pt-6 border-t">
      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CogIcon className="h-4 w-4" />
        Votre espace
      </h5>
      <ul className="space-y-2">
        {features.map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer py-2.5 px-3 rounded-lg transition-all duration-200">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const VendorSection = ({ handlers }) => (
  <div className="bg-gradient-to-br from-green-50/50 to-white border border-green-100 rounded-2xl p-5 hover:border-green-300 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-green-100 rounded-xl"><BuildingStorefrontIcon className="h-8 w-8 text-green-700" /></div>
      <div>
        <h4 className="font-bold text-lg text-gray-900">Espace Vendeur</h4>
        <p className="text-sm text-gray-500">Développez votre business</p>
      </div>
    </div>

    <div className="space-y-4">
      <button onClick={handlers.loginVendor} className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
        Connexion vendeur
      </button>
      <p className="text-sm text-center">
        Nouveau vendeur ?{" "}
        <span onClick={handlers.registerVendor} className="text-green-700 font-semibold cursor-pointer hover:underline">
          Devenir vendeur
        </span>
      </p>
    </div>

    <VendorFeatures />
  </div>
);

const VendorFeatures = () => {
  const features = [
    { icon: ChartBarIcon, label: "Tableau de bord" },
    { icon: BuildingStorefrontIcon, label: "Gérer produits" },
    { icon: TruckIcon, label: "Commandes" },
    { icon: CogIcon, label: "Paramètres boutique" }
  ];
  
  return (
    <div className="mt-6 pt-6 border-t">
      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChartBarIcon className="h-4 w-4" />
        Votre boutique
      </h5>
      <ul className="space-y-2">
        {features.map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-600 hover:text-green-700 hover:bg-green-50 cursor-pointer py-2.5 px-3 rounded-lg transition-all duration-200">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const StatsSection = () => (
  <div className="mt-8 pt-8 border-t">
    <div className="grid grid-cols-3 gap-4">
      <Stat number="500K+" label="Membres" />
      <Stat number="10K+" label="Vendeurs" />
      <Stat number="1M+" label="Produits" />
    </div>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-green-700">{number}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// MobileMenu (avec forwardRef)
const MobileMenu = forwardRef(({ isAuthenticated, isClient, handlers, onLogout, onClose, navigate }, ref) => (
  <div ref={ref} className="lg:hidden absolute top-full left-0 right-0 bg-white border-t shadow-xl rounded-b-2xl animate-slideDown z-50">
    <div className="p-6">
      <MobileSearch />
      <MobileCategories onClose={onClose} navigate={navigate} />
      <MobileActions isAuthenticated={isAuthenticated} isClient={isClient} handlers={handlers} onLogout={onLogout} navigate={navigate} onClose={onClose} />
      <MobileInfo />
    </div>
  </div>
));

const MobileSearch = () => (
  <div className="mb-6">
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input type="text" placeholder="Rechercher..." className="w-full border rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  </div>
);

const MobileCategories = ({ onClose, navigate }) => (
  <div className="mb-6">
    <h4 className="font-bold text-gray-900 mb-4">Catégories</h4>
    <div className="space-y-2">
      {CATEGORIES.map((category) => (
        <div key={category.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => { onClose(); navigate(`/category/${category.id}`); }}>
          <div className={`p-2 ${category.bgColor} rounded-lg`}>
            <category.icon className={`h-5 w-5 ${category.color}`} />
          </div>
          <span className="font-medium">{category.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const MobileActions = ({ isAuthenticated, isClient, handlers, onLogout, navigate, onClose }) => (
  <div className="space-y-3">
    {isAuthenticated ? (
      <>
        <button onClick={handlers.profile} className="w-full bg-green-700 text-white py-3 rounded-lg font-medium">Mon profil</button>
        <button onClick={() => { navigate(isClient ? "/profile?tab=orders" : "/vendor/dashboard?tab=orders"); onClose(); }} className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-medium">
          Mes commandes
        </button>
        <button onClick={onLogout} className="w-full border border-red-600 text-red-600 py-3 rounded-lg font-medium">Déconnexion</button>
      </>
    ) : (
      <>
        <button onClick={handlers.loginClient} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium">Se connecter</button>
        <button onClick={handlers.registerClient} className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium">Créer un compte</button>
        <button onClick={handlers.loginVendor} className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-medium">Espace vendeur</button>
      </>
    )}
  </div>
);

const MobileInfo = () => (
  <div className="mt-6 pt-6 border-t">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <TruckIcon className="h-5 w-5 text-green-700" />
        <div>
          <p className="font-medium">Livraison offerte</p>
          <p className="text-sm text-gray-500">Dès 50€ d'achat</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-5 w-5 text-green-700" />
        <div>
          <p className="font-medium">Paiement sécurisé</p>
          <p className="text-sm text-gray-500">100% sécurisé</p>
        </div>
      </div>
    </div>
  </div>
);


