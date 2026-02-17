import React, { useState, useEffect } from 'react';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [selectedProduct, setSelectedProduct] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Couleurs correspondant aux catégories principales
  const categoryColors = {
    'Électronique': {
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50'
    },
    'Mode': {
      gradient: 'from-fuchsia-500 to-pink-500',
      icon: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/20',
      border: 'border-fuchsia-500',
      text: 'text-fuchsia-600',
      lightBg: 'bg-fuchsia-50'
    },
    'Maison': {
      gradient: 'from-emerald-500 to-teal-500',
      icon: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500',
      text: 'text-emerald-600',
      lightBg: 'bg-emerald-50'
    },
    'Sport': {
      gradient: 'from-orange-500 to-amber-500',
      icon: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50'
    },
    'Beauté': {
      gradient: 'from-purple-500 to-violet-500',
      icon: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50'
    },
    'Informatique': {
      gradient: 'from-indigo-500 to-blue-500',
      icon: 'text-indigo-400',
      bg: 'bg-indigo-500/20',
      border: 'border-indigo-500',
      text: 'text-indigo-600',
      lightBg: 'bg-indigo-50'
    },
    'Audio': {
      gradient: 'from-teal-500 to-emerald-500',
      icon: 'text-teal-400',
      bg: 'bg-teal-500/20',
      border: 'border-teal-500',
      text: 'text-teal-600',
      lightBg: 'bg-teal-50'
    },
    'Photographie': {
      gradient: 'from-violet-500 to-purple-500',
      icon: 'text-violet-400',
      bg: 'bg-violet-500/20',
      border: 'border-violet-500',
      text: 'text-violet-600',
      lightBg: 'bg-violet-50'
    }
  };

  const flashProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      originalPrice: 1399,
      flashPrice: 1099,
      discount: 21,
      category: 'Électronique',
      colors: categoryColors['Électronique'],
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=60',
      stock: 15,
      sold: 85,
      features: ['Écran Super Retina XDR', 'Chip A17 Pro', '5x Zoom Optique'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      originalPrice: 2499,
      flashPrice: 1999,
      discount: 20,
      category: 'Informatique',
      colors: categoryColors['Informatique'],
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=60',
      stock: 8,
      sold: 92,
      features: ['Chip M3 Pro', 'Écran Liquid Retina', '18h Autonomie'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      originalPrice: 399,
      flashPrice: 299,
      discount: 25,
      category: 'Audio',
      colors: categoryColors['Audio'],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60',
      stock: 22,
      sold: 78,
      features: ['Réduction de bruit', '30h Autonomie', 'Qualité Hi-Res'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Canon EOS R6',
      originalPrice: 2499,
      flashPrice: 1999,
      discount: 20,
      category: 'Photographie',
      colors: categoryColors['Photographie'],
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop&q=60',
      stock: 6,
      sold: 94,
      features: ['Capteur 20MP', 'Stabilisation 8 stops', '4K 60fps'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'Nike Air Max 270',
      originalPrice: 159,
      flashPrice: 99,
      discount: 38,
      category: 'Sport',
      colors: categoryColors['Sport'],
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60',
      stock: 42,
      sold: 58,
      features: ['Air Max', 'Confort optimal', 'Style urbain'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Samsung QLED 4K',
      originalPrice: 899,
      flashPrice: 649,
      discount: 28,
      category: 'Électronique',
      colors: categoryColors['Électronique'],
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=60',
      stock: 18,
      sold: 82,
      features: ['4K UHD', 'Smart TV', 'Quantum Dot'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const selected = flashProducts.find(p => p.id === selectedProduct);

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête avec timer */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                VENTE FLASH EXCLUSIVE
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Jusqu'à{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                50% de réduction
              </span>
            </h2>
            <p className="text-gray-600 mt-3">Offres limitées dans le temps. Dépêchez-vous !</p>
          </div>

          {/* Timer */}
          <div className="mt-8 lg:mt-0">
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-2 font-medium">L'OFFRE SE TERMINE DANS</p>
            </div>
            <div className="flex gap-4">
              {['HEURES', 'MINUTES', 'SECONDES'].map((label, index) => (
                <div key={label} className="text-center">
                  <div className="bg-white rounded-xl p-4 w-20 shadow-lg border border-gray-200">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {timeLeft[label.toLowerCase().slice(0, -1)]}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm mt-2 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid des produits */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Produit principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-80 lg:h-full">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`bg-gradient-to-r ${selected.colors.gradient} text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg`}>
                      -{selected.discount}%
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 font-medium">Stock restant</span>
                        <span className="text-sm font-bold text-gray-900">{selected.stock} unités</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${selected.colors.gradient} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(selected.sold / (selected.sold + selected.stock)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{selected.sold} vendus</span>
                        <span>Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${selected.colors.bg}`}>
                      <div className={selected.colors.icon}>
                        {selected.icon}
                      </div>
                    </div>
                    <span className={`font-semibold ${selected.colors.text}`}>{selected.category}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{selected.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-600 font-medium">Fonctionnalités principales :</p>
                    {selected.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-4">
                      <div className="text-4xl font-bold text-gray-900">{selected.flashPrice}€</div>
                      <div className="text-2xl text-gray-400 line-through">{selected.originalPrice}€</div>
                      <div className="text-green-600 font-bold">
                        Économisez {selected.originalPrice - selected.flashPrice}€
                      </div>
                    </div>
                    
                    <button className={`w-full bg-gradient-to-r ${selected.colors.gradient} hover:opacity-90 text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Acheter Maintenant
                    </button>
                    
                    <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Ajouter aux Favoris
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des autres produits */}
          <div className="space-y-4">
            {flashProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`w-full bg-white rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                  selectedProduct === product.id 
                    ? `${product.colors.border} border-2 scale-[1.02] ${product.colors.lightBg}` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${product.colors.gradient} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                      -{product.discount}%
                    </div>
                  </div>
                  
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${product.colors.gradient}`}></div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">{product.flashPrice}€</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}€</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`bg-gradient-to-r ${product.colors.gradient} h-1.5 rounded-full`}
                          style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{product.sold}% vendus</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques par catégorie */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(categoryColors).slice(0, 4).map(([category, colors], index) => (
            <div key={index} className={`${colors.lightBg} rounded-2xl p-6 border ${colors.border} shadow-lg`}>
              <div className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-2`}>
                {['85%', '24h', '100%', '30j'][index]}
              </div>
              <div className={`${colors.text} font-medium`}>
                {['Clients satisfaits', 'Livraison rapide', 'Paiement sécurisé', 'Retour gratuit'][index]}
              </div>
              <div className="text-sm text-gray-600 mt-1">{category}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 border-2 border-orange-500 rounded-full text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
            <span className="relative z-10 flex items-center gap-3">
              Voir toutes les offres flash
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}