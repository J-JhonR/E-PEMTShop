import React, { useState } from 'react';

export default function PopularProducts() {
  const [activeFilter, setActiveFilter] = useState('tous');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const filters = [
    { 
      id: 'tous', 
      label: 'Toutes les catégories', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: 'electronique', 
      label: 'Électronique', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      id: 'mode', 
      label: 'Mode & Style', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'maison', 
      label: 'Maison & Déco', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'sport', 
      label: 'Sport & Fitness', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const popularProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Électronique',
      price: 1299,
      originalPrice: 1499,
      discount: 13,
      rating: 4.9,
      reviews: 3421,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
      badge: 'BESTSELLER',
      badgeColor: 'bg-gradient-to-r from-red-500 to-orange-500',
      features: ['Écran Super Retina XDR', 'Chip A17 Pro', '5x Zoom optique'],
      soldLastMonth: 1245,
      tags: ['Nouveau', 'Promo', 'Tendance']
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      category: 'Mode & Style',
      price: 149,
      originalPrice: 189,
      discount: 21,
      rating: 4.8,
      reviews: 2896,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
      badge: 'TOP VENTE',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      features: ['Air cushioning', 'Design respirant', 'Confort optimal'],
      soldLastMonth: 892,
      tags: ['Sport', 'Confort']
    },
    {
      id: 3,
      name: 'MacBook Pro M3',
      category: 'Électronique',
      price: 2499,
      originalPrice: 2999,
      discount: 17,
      rating: 4.9,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
      badge: 'PROFESSIONNEL',
      badgeColor: 'bg-gradient-to-r from-gray-800 to-gray-900',
      features: ['Chip M3 Pro', 'Écran Liquid Retina', '18h autonomie'],
      soldLastMonth: 543,
      tags: ['Pro', 'Performance']
    },
    {
      id: 4,
      name: 'Canapé Chesterfield',
      category: 'Maison & Déco',
      price: 1899,
      originalPrice: 2499,
      discount: 24,
      rating: 4.7,
      reviews: 654,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80',
      badge: 'LUXE',
      badgeColor: 'bg-gradient-to-r from-amber-700 to-yellow-600',
      features: ['Cuir véritable', 'Rembourrage dense', 'Structure bois'],
      soldLastMonth: 231,
      tags: ['Design', 'Premium']
    },
    {
      id: 5,
      name: 'PlayStation 5',
      category: 'Électronique',
      price: 499,
      originalPrice: 599,
      discount: 17,
      rating: 4.8,
      reviews: 4321,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&auto=format&fit=crop&q=80',
      badge: 'GAMING',
      badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      features: ['SSD ultra-rapide', 'Ray Tracing', 'Compatibilité PS4'],
      soldLastMonth: 1567,
      tags: ['Gaming', 'Nouveau']
    },
    {
      id: 6,
      name: 'Montre Connectée Fitness',
      category: 'Sport & Fitness',
      price: 329,
      originalPrice: 429,
      discount: 23,
      rating: 4.6,
      reviews: 1876,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=80',
      badge: 'SANTÉ',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
      features: ['Suivi santé', 'GPS intégré', '7 jours batterie'],
      soldLastMonth: 654,
      tags: ['Sport', 'Connecté']
    },
    {
      id: 7,
      name: 'Sac à Main Designer',
      category: 'Mode & Style',
      price: 599,
      originalPrice: 899,
      discount: 33,
      rating: 4.9,
      reviews: 987,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
      badge: 'DESIGNER',
      badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
      features: ['Cuir premium', 'Doublure soie', 'Serrure dorée'],
      soldLastMonth: 432,
      tags: ['Luxe', 'Élégant']
    },
    {
      id: 8,
      name: 'Kit Cuisine Professionnelle',
      category: 'Maison & Déco',
      price: 299,
      originalPrice: 499,
      discount: 40,
      rating: 4.8,
      reviews: 765,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80',
      badge: 'CUISINE',
      badgeColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
      features: ['20 pièces', 'Acier inoxydable', 'Garantie à vie'],
      soldLastMonth: 321,
      tags: ['Professionnel', 'Complet']
    }
  ];

  const filteredProducts = activeFilter === 'tous' 
    ? popularProducts 
    : popularProducts.filter(product => 
        product.category.toLowerCase().includes(activeFilter.toLowerCase())
      );

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-6 py-3 rounded-full mb-6">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="font-bold text-blue-700 text-lg">RECOMMANDÉ PAR LA COMMUNAUTÉ</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Découvrez Nos{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Produits Stars
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sélectionnés parmi des milliers d'avis clients. Ces produits ont conquis notre communauté 
            par leur qualité exceptionnelle et leur rapport qualité-prix imbattable.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {filter.icon}
              <span className="font-semibold whitespace-nowrap">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Grid Produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`${product.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                    {product.badge}
                  </span>
                </div>

                {/* Discount Tag */}
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                  -{product.discount}%
                </div>

                {/* Tags */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="w-full space-y-3">
                    <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Ajouter au Panier
                    </button>
                    <button className="w-full bg-transparent border-2 border-white text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir Détails
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h3>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">{product.price}€</span>
                      <span className="text-lg text-gray-500 line-through">{product.originalPrice}€</span>
                      <span className="text-green-600 font-bold text-sm">
                        Économisez {product.originalPrice - product.price}€
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.soldLastMonth.toLocaleString()} ventes ce mois
                    </div>
                  </div>

                  {/* Stock Indicator */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300 ${
                hoveredProduct === product.id 
                  ? 'ring-2 ring-blue-400 ring-opacity-50' 
                  : ''
              }`} />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Produits Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Note Moyenne Clients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Client</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-6">
            <button className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300">
              <span className="flex items-center gap-3">
                Explorer Tous les Produits
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
            <button className="px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all duration-300">
              Voir les Nouveautés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}