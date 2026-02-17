import React, { useState } from 'react';

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState('tous');

  const categories = [
    { 
      id: 'tous', 
      name: 'Tous', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ), 
      description: 'Tous nos produits',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
      color: 'from-purple-600 to-pink-500'
    },
    { 
      id: 'vetements', 
      name: 'Mode', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), 
      description: 'Mode tendance 2024',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=60',
      color: 'from-pink-500 to-rose-400'
    },
    { 
      id: 'electronique', 
      name: 'Tech', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ), 
      description: 'Innovation & Gadgets',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60',
      color: 'from-blue-600 to-cyan-400'
    },
    { 
      id: 'maison', 
      name: 'Maison', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      description: 'Design & Déco',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=60',
      color: 'from-amber-600 to-yellow-400'
    },
    { 
      id: 'sport', 
      name: 'Sport', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      description: 'Performance & Style',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60',
      color: 'from-green-600 to-emerald-400'
    },
    { 
      id: 'beaute', 
      name: 'Beauté', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      description: 'Soins & Cosmétiques',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60',
      color: 'from-fuchsia-600 to-purple-400'
    },
    { 
      id: 'luxe', 
      name: 'Luxe', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ), 
      description: 'Produits d\'exception',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
      color: 'from-amber-700 to-yellow-500'
    },
    { 
      id: 'art', 
      name: 'Art', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ), 
      description: 'Créations uniques',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop&q=60',
      color: 'from-indigo-600 to-violet-500'
    }
  ];

  const featuredProducts = {
    tous: [
      { name: 'iPhone 15 Pro Max', category: 'Tech', price: 1299, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Sac Chanel Vintage', category: 'Luxe', price: 3500, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
      { name: 'Canapé Velours', category: 'Maison', price: 1899, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=60', rating: 4.7 },
    ],
    vetements: [
      { name: 'Robe Soirée Dior', category: 'Mode', price: 890, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Costume Sur-mesure', category: 'Mode', price: 1250, image: 'https://images.unsplash.com/photo-1594938351152-7b8c6c2c3f3a?w=400&auto=format&fit=crop&q=60', rating: 5.0 },
      { name: 'Chaussures Louboutin', category: 'Mode', price: 795, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
    ],
    electronique: [
      { name: 'MacBook Pro M3', category: 'Tech', price: 2499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Sony A7 IV', category: 'Tech', price: 3299, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
      { name: 'AirPods Max', category: 'Tech', price: 549, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&auto=format&fit=crop&q=60', rating: 4.7 },
    ],
    maison: [
      { name: 'Lit Design Italien', category: 'Maison', price: 3200, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
      { name: 'Table Marbre', category: 'Maison', price: 4500, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Lustre Cristal', category: 'Maison', price: 2800, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60', rating: 4.7 },
    ],
    sport: [
      { name: 'Vélo Carbon Specialized', category: 'Sport', price: 8500, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Montre Garmin Fenix', category: 'Sport', price: 899, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
      { name: 'Raquette Tennis Pro', category: 'Sport', price: 329, image: 'https://images.unsplash.com/photo-1622279487601-8d0f6d2c72b6?w=400&auto=format&fit=crop&q=60', rating: 4.7 },
    ],
    beaute: [
      { name: 'Crème La Mer', category: 'Beauté', price: 450, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Parfum Chanel N°5', category: 'Beauté', price: 180, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=60', rating: 5.0 },
      { name: 'Kit Soin Dior', category: 'Beauté', price: 320, image: 'https://images.unsplash.com/photo-1522338242990-ea1f7d132b43?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
    ],
    luxe: [
      { name: 'Rolex Daytona', category: 'Luxe', price: 38500, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=60', rating: 5.0 },
      { name: 'Sac Hermès Birkin', category: 'Luxe', price: 25000, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Diamant 3 Carats', category: 'Luxe', price: 75000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=60', rating: 5.0 },
    ],
    art: [
      { name: 'Tableau Contemporain', category: 'Art', price: 12000, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&auto=format&fit=crop&q=60', rating: 4.9 },
      { name: 'Sculpture Bronze', category: 'Art', price: 8500, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&auto=format&fit=crop&q=60', rating: 4.8 },
      { name: 'Photographie Édition Limitée', category: 'Art', price: 3200, image: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&auto=format&fit=crop&q=60', rating: 4.7 },
    ],
  };

  const currentProducts = featuredProducts[activeCategory] || featuredProducts.tous;
  const currentCategory = categories.find(c => c.id === activeCategory);

  const statsIcons = [
    (
      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    (
      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    (
      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    (
      <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  ];

  const stats = [
    { value: '1M+', label: 'Clients Satisfaits' },
    { value: '50K+', label: 'Produits Exceptionnels' },
    { value: '150+', label: 'Artisans Partenaires' },
    { value: '24/7', label: 'Conseil Personnalisé' },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Hero Background avec image dynamique */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%), url('${currentCategory?.image}')`,
        }}
      >
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory?.color} opacity-20 mix-blend-overlay`}></div>
        
        {/* Particules animées */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight">
            L'Excellence à{' '}
            <span className="bg-gradient-to-r from-white via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              Votre Portée
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Découvrez un univers où chaque produit raconte une histoire d'exception. 
            Des pièces uniques sélectionnées avec passion pour ceux qui recherchent l'excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300">
              <span className="relative z-10">Découvrir la Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="px-10 py-4 border-2 border-white/30 hover:border-white/60 rounded-full text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              Explorer les Exclusivités
            </button>
          </div>
        </div>

        {/* Navigation Catégories */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Nos Univers d'Excellence
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
                  activeCategory === category.id 
                    ? 'ring-2 ring-white ring-opacity-50 scale-[1.02]' 
                    : 'hover:scale-[1.02]'
                }`}
              >
                {/* Fond avec flou d'image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
                
                {/* Contenu */}
                <div className="relative z-10 text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 opacity-90">{category.description}</p>
                  
                  {/* Indicateur de sélection */}
                  {activeCategory === category.id && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Produits Phares */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Trésors de l'Univers{' '}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  {currentCategory?.name}
                </span>
              </h2>
              <p className="text-gray-300">Des pièces rares sélectionnées pour vous</p>
            </div>
            
            <button className="px-6 py-3 border border-white/30 hover:border-white/60 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300">
              Voir tout →
            </button>
          </div>

          {/* Grid Produits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentProducts.map((product, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Image Produit */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Badge Note */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating}
                  </div>
                  
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Découvrir ce Trésor
                    </button>
                  </div>
                </div>
                
                {/* Infos Produit */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="text-xl font-bold mt-1">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                        {product.price.toLocaleString()}€
                      </div>
                      <div className="text-xs text-gray-400">Prix exclusif</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      + Détails
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Ajouter aux Favoris
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bannière Exclusive */}
        <div className="relative rounded-3xl overflow-hidden mb-20">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Collection exclusive"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
          
          <div className="relative p-12 md:p-16">
            <div className="max-w-2xl">
              <span className="inline-block bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                COLLECTION LIMITÉE
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                L'Art de l'Exception
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Des pièces uniques, des savoir-faire rares. Notre collection exclusive 
                réunit les plus beaux trésors du monde entier.
              </p>
              <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2">
                Accéder à l'Exclusivité
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Impressionnantes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className="mb-4 text-amber-400">
                {statsIcons[index]}
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Ligne scintillante */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}