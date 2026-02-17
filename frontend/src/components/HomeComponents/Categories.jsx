import React, { useState } from 'react';

export default function Categories() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Électronique',
      description: 'High-tech & Gadgets',
      products: '2500+ Produits',
      color: 'from-blue-500 to-cyan-400',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      popular: ['Smartphones', 'Ordinateurs', 'Audio'],
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Mode & Vêtements',
      description: 'Style & Élégance',
      products: '1800+ Produits',
      color: 'from-fuchsia-500 to-pink-400',
      textColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      popular: ['Robes', 'Chaussures', 'Accessoires'],
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      name: 'Maison & Déco',
      description: 'Confort & Design',
      products: '3200+ Produits',
      color: 'from-emerald-500 to-teal-400',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      popular: ['Meubles', 'Luminaires', 'Décoration'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      name: 'Sport & Fitness',
      description: 'Performance & Santé',
      products: '1500+ Produits',
      color: 'from-orange-500 to-amber-400',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      popular: ['Équipement', 'Vêtements', 'Accessoires'],
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 5,
      name: 'Beauté & Soins',
      description: 'Bien-être & Cosmétiques',
      products: '2100+ Produits',
      color: 'from-purple-500 to-violet-400',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      popular: ['Maquillage', 'Soins Visage', 'Parfums'],
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 6,
      name: 'Livres & Éducation',
      description: 'Savoir & Culture',
      products: '2800+ Produits',
      color: 'from-indigo-500 to-blue-400',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      popular: ['Romans', 'Éducatif', 'Professionnel'],
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 7,
      name: 'Alimentation',
      description: 'Gastronomie & Épicerie',
      products: '1900+ Produits',
      color: 'from-red-500 to-rose-400',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      popular: ['Bio', 'Vins', 'Spécialités'],
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 8,
      name: 'Jardin & Extérieur',
      description: 'Nature & Plein Air',
      products: '1200+ Produits',
      color: 'from-green-500 to-emerald-400',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      popular: ['Outils', 'Plantes', 'Mobilier'],
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 9,
      name: 'Auto & Moto',
      description: 'Mobilité & Entretien',
      products: '800+ Produits',
      color: 'from-gray-600 to-gray-800',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-100',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      popular: ['Pièces', 'Accessoires', 'Équipement'],
      image: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=800&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-semibold">EXPLOREZ NOS UNIVERS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Parcourez Nos{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Catégories Premium
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez des collections soigneusement sélectionnées dans chaque univers. 
            Des produits de qualité qui répondent à toutes vos envies.
          </p>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image de fond avec overlay coloré */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              </div>
              
              {/* Contenu */}
              <div className="relative p-8 h-80 flex flex-col">
                {/* En-tête de la catégorie */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Badge produits */}
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {category.products}
                  </div>
                </div>
                
                {/* Liste des produits populaires */}
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300 text-sm font-medium">POPULAIRE :</p>
                  <div className="flex flex-wrap gap-2">
                    {category.popular.map((item, index) => (
                      <span 
                        key={index} 
                        className={`${category.bgColor} ${category.textColor} px-3 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Indicateur de hover */}
                <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gradient-to-r ${category.color} ${hoveredCategory === category.id ? 'animate-ping' : ''}`} />
                
                {/* Overlay d'action */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Bouton d'exploration */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className={`w-full bg-gradient-to-r ${category.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3`}>
                    <span>Explorer {category.name}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { value: '9+', label: 'Catégories', color: 'from-blue-500 to-cyan-500' },
            { value: '13K+', label: 'Produits', color: 'from-fuchsia-500 to-pink-500' },
            { value: '50+', label: 'Marques', color: 'from-emerald-500 to-teal-500' },
            { value: '24/7', label: 'Support', color: 'from-orange-500 to-amber-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h3>
              <p className="text-gray-600 mb-6">
                Notre équipe d'experts peut vous aider à trouver exactement le produit parfait.
                Demandez une consultation personnalisée.
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300">
                  Contacter un Expert
                </button>
                <button className="text-blue-600 font-semibold hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span>Voir toutes les catégories</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}