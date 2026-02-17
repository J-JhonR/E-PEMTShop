// src/pages/ClientProfile.jsx
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api.service';
import {
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  CameraIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HeartIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// Constantes
const TABS = [
  { id: 'overview', label: 'Dashboard', icon: ChartBarIcon },
  { id: 'orders', label: 'Mes achats', icon: ShoppingBagIcon },
  { id: 'settings', label: 'Informations', icon: UserIcon },
  { id: 'addresses', label: 'Adresses', icon: MapPinIcon },
  { id: 'wishlist', label: 'Favoris', icon: HeartIcon },
];

const HAITI_DEPARTMENTS = [
  'Artibonite', 'Centre', 'Grand\'Anse', 'Nippes', 'Nord', 
  'Nord-Est', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Est'
];

const PHONE_REGEX = /^(?:\+509|0)?[3-5]\d{7}$/;

const STAT_COLOR_CLASSES = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-600' }
};

const STATUS_CLASSES = {
  yellow: 'bg-yellow-50 text-yellow-700',
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-50 text-gray-700'
};

// Fonction utilitaire pour formater le numéro haïtien
const formatHaitiPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  if (cleaned.length === 10 && cleaned.startsWith('509')) {
    return `+509 ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Composants statistiques
const StatCard = ({ icon: Icon, label, value, color = 'emerald' }) => (
  (() => {
    const style = STAT_COLOR_CLASSES[color] || STAT_COLOR_CLASSES.gray;
    return (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 ${style.bg} rounded-lg group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${style.text}`} />
      </div>
    </div>
  </div>
    );
  })()
);

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'yellow', icon: ClockIcon },
    paid: { label: 'Payée', color: 'green', icon: CheckCircleIcon },
    shipped: { label: 'Expédiée', color: 'blue', icon: TruckIcon },
    delivered: { label: 'Livrée', color: 'emerald', icon: CheckBadgeIcon },
    cancelled: { label: 'Annulée', color: 'red', icon: DocumentTextIcon }
  };

  const config = statusConfig[status] || { label: status, color: 'gray', icon: DocumentTextIcon };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_CLASSES[config.color] || STATUS_CLASSES.gray}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

// Composant d'avatar
const ProfileAvatar = ({ user, onUpload, uploading }) => {
  const backendOrigin = (API.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  
  const resolveAvatarUrl = (value) => {
    if (!value) return '';
    if (String(value).startsWith('http://') || String(value).startsWith('https://')) return value;
    return `${backendOrigin}${value}`;
  };

  return (
    <div className="relative group">
      <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 overflow-hidden">
        {user?.avatarUrl ? (
          <img
            src={resolveAvatarUrl(user.avatarUrl)}
            alt={user.firstName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-emerald-500" />
          </div>
        )}
      </div>
      
      <label className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 rounded-lg text-white cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg group-hover:scale-110">
        <CameraIcon className="h-4 w-4" />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      
      {uploading && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

// Composant d'adresse
const AddressCard = ({ address, onEdit, onDelete, isDefault }) => (
  <div className={`border rounded-xl p-5 ${isDefault ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-200'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-5 w-5 text-emerald-600" />
        <h4 className="font-semibold text-gray-900">{address.label || 'Adresse'}</h4>
        {isDefault && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            Par défaut
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <PencilIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
    
    <div className="space-y-2 text-sm text-gray-600">
      <p>{address.street}</p>
      <p>{address.city}, {address.department} {address.postalCode}</p>
      {address.phone && (
        <p className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4" />
          {formatHaitiPhone(address.phone)}
        </p>
      )}
    </div>
  </div>
);

// Composant principal
export default function ClientProfile() {
  const { user, setUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || '',
    newsletter: user?.newsletter || false
  });

  // Validation du numéro haïtien
  const validatePhone = (phone) => {
    if (!phone) return true;
    return PHONE_REGEX.test(phone.replace(/\s/g, ''));
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [meRes, ordersRes, addressesRes, wishlistRes] = await Promise.allSettled([
          API.get('/public/me'),
          API.get('/public/my-orders'),
          API.get('/public/addresses'),
          API.get('/public/wishlist')
        ]);

        const me = meRes.status === 'fulfilled' ? meRes.value?.data?.data : null;
        const myOrders = ordersRes.status === 'fulfilled' ? (ordersRes.value?.data?.data || []) : [];
        const myAddresses = addressesRes.status === 'fulfilled' ? (addressesRes.value?.data?.data || []) : [];
        const myWishlist = wishlistRes.status === 'fulfilled' ? (wishlistRes.value?.data?.data || []) : [];

        if (meRes.status === 'rejected' || ordersRes.status === 'rejected') {
          setMessage({ type: 'error', text: 'Impossible de charger vos données principales.' });
        }

        if (me) {
          const nextUser = {
            ...(user || {}),
            id: me.id,
            email: me.email,
            firstName: me.firstName,
            lastName: me.lastName,
            phone: me.phone,
            avatarUrl: me.avatarUrl || null,
            role: me.role,
            birthDate: me.birthDate || '',
            gender: me.gender || '',
            newsletter: me.newsletter || false
          };
          
          localStorage.setItem('userData', JSON.stringify(nextUser));
          setUser(nextUser);
          
          setForm({
            firstName: me.firstName || '',
            lastName: me.lastName || '',
            phone: me.phone || '',
            birthDate: me.birthDate || '',
            gender: me.gender || '',
            newsletter: me.newsletter || false
          });
        }

        setOrders(myOrders);
        setAddresses(myAddresses);
        setWishlist(myWishlist);
      } catch (_e) {
        setMessage({ type: 'error', text: 'Impossible de charger vos données.' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.payment_status === 'paid').length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalItemsPurchased = orders.reduce((sum, order) => {
      const itemCount = Array.isArray(order.items)
        ? order.items.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
        : 0;
      return sum + itemCount;
    }, 0);
    
    return {
      totalOrders,
      paidOrders,
      totalSpent: totalSpent.toFixed(2),
      pendingOrders,
      totalItemsPurchased,
      averageOrder: totalOrders ? (totalSpent / totalOrders).toFixed(2) : 0
    };
  }, [orders]);

  const recentPurchasedItems = useMemo(() => {
    return orders
      .flatMap((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        return items.map((item) => ({
          orderId: order.id,
          orderNumber: order.order_number,
          placedAt: order.placed_at,
          title: item.product_title || 'Produit',
          quantity: Number(item.quantity || 0)
        }));
      })
      .slice(0, 8);
  }, [orders]);

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setMessage({ type: 'error', text: 'Le prénom et le nom sont obligatoires.' });
      return;
    }

    if (form.phone && !validatePhone(form.phone)) {
      setMessage({ type: 'error', text: 'Format de téléphone haïtien invalide. Ex: +509 1234-5678 ou 3412-3456' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone
      };
      const res = await API.put('/public/me/profile', payload);
      const updated = res?.data?.data;
      
      if (updated) {
        const nextUser = {
          ...(user || {}),
          firstName: updated.firstName,
          lastName: updated.lastName,
          phone: updated.phone,
          avatarUrl: updated.avatarUrl || user?.avatarUrl || null
        };
        
        localStorage.setItem('userData', JSON.stringify(nextUser));
        setUser(nextUser);
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      }
    } catch (e2) {
      setMessage({ 
        type: 'error', 
        text: e2?.response?.data?.message || 'Erreur lors de la mise à jour.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image trop lourde. Maximum 2MB.' });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Format non supporté. Utilisez JPG, PNG ou WEBP.' });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      setAvatarUploading(true);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const res = await API.post('/public/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const avatarUrl = res?.data?.data?.avatarUrl || null;
      const nextUser = { ...(user || {}), avatarUrl };
      
      localStorage.setItem('userData', JSON.stringify(nextUser));
      setUser(nextUser);
      setMessage({ type: 'success', text: 'Photo de profil mise à jour !' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Erreur lors de l\'upload.' 
      });
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <ProfileAvatar 
              user={user} 
              onUpload={uploadAvatar} 
              uploading={avatarUploading}
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  Client
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <PhoneIcon className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">{formatHaitiPhone(user.phone)}</span>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message de notification */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {/* DASHBOARD */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={ShoppingBagIcon} label="Total commandes" value={stats.totalOrders} color="emerald" />
                <StatCard icon={CheckCircleIcon} label="Commandes payées" value={stats.paidOrders} color="green" />
                <StatCard icon={ClockIcon} label="En attente" value={stats.pendingOrders} color="yellow" />
                <StatCard icon={CurrencyDollarIcon} label="Total dépensé" value={`${stats.totalSpent} G`} color="purple" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard icon={GiftIcon} label="Produits achetés" value={stats.totalItemsPurchased} color="emerald" />
                <StatCard icon={ChartBarIcon} label="Panier moyen" value={`${stats.averageOrder} G`} color="green" />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-emerald-600" />
                  Activité récente
                </h3>
                
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.placed_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{Number(order.total_amount).toFixed(2)} G</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
                  Produits achetés récemment
                </h3>

                {recentPurchasedItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun produit acheté pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {recentPurchasedItems.map((item, index) => (
                      <div key={`${item.orderId}-${index}`} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.orderNumber}</p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* MES ACHATS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-transparent">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
                  Historique des commandes
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
	                    <tr>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
	                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
	                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
	                    {orders.length === 0 ? (
	                      <tr>
	                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
	                          <ShoppingBagIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
	                          <p>Aucune commande pour le moment</p>
	                        </td>
	                      </tr>
	                    ) : (
	                      orders.map((order) => (
	                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
	                          <td className="px-6 py-4 font-medium">{order.order_number}</td>
	                          <td className="px-6 py-4 text-sm text-gray-700">
	                            {Array.isArray(order.items) && order.items.length > 0 ? (
	                              <div className="space-y-1">
	                                {order.items.slice(0, 2).map((item, idx) => (
	                                  <p key={`${order.id}-${idx}`} className="truncate max-w-[260px]">
	                                    {item.product_title} x{item.quantity}
	                                  </p>
	                                ))}
	                                {order.items.length > 2 && (
	                                  <p className="text-xs text-gray-500">+{order.items.length - 2} autre(s)</p>
	                                )}
	                              </div>
	                            ) : (
	                              <span className="text-gray-400">Produit non disponible</span>
	                            )}
	                          </td>
	                          <td className="px-6 py-4 text-sm text-gray-600">
	                            {new Date(order.placed_at).toLocaleDateString('fr-FR')}
	                          </td>
                          <td className="px-6 py-4 font-medium">{Number(order.total_amount).toFixed(2)} G</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MES INFORMATIONS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-emerald-600" />
                Informations personnelles
              </h3>
              
              <form onSubmit={saveProfile} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Jean"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone (Haïti)
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="+509 3412-3456 ou 3412-3456"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: +509 1234-5678 ou 3412-3456
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm(p => ({ ...p, birthDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MES ADRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-emerald-600" />
                  Mes adresses de livraison
                </h3>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Ajouter une adresse
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Aucune adresse enregistrée</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <AddressCard 
                      key={address.id} 
                      address={address}
                      isDefault={address.isDefault}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* MES FAVORIS */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-emerald-600" />
                Ma liste de souhaits
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <HeartIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Votre liste de souhaits est vide</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mapping des produits favoris */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
