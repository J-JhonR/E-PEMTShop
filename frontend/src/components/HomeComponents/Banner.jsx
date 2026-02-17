import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Phone, 
  Gift, 
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const announcements = [
    {
      id: 1,
      icon: <Truck className="w-5 h-5" />,
      text: "🚀 Livraison gratuite à partir de 50€ d'achat",
      badge: "NOUVEAU",
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800"
    },
    {
      id: 2,
      icon: <Gift className="w-5 h-5" />,
      text: "🎁 -20% sur votre première commande avec le code BIENVENUE",
      badge: "PROMO",
      color: "from-purple-600 to-pink-500",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800"
    },
    {
      id: 3,
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "🛡️ Paiement 100% sécurisé & Garantie satisfait ou remboursé",
      badge: "SÉCURITÉ",
      color: "from-emerald-600 to-green-500",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800"
    },
    {
      id: 4,
      icon: <Phone className="w-5 h-5" />,
      text: "📞 Support client 7j/7 : 01 23 45 67 89",
      badge: "SUPPORT",
      color: "from-orange-600 to-amber-500",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800"
    }
  ];

  const currentAnnouncement = announcements[currentSlide];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`relative bg-gradient-to-r ${currentAnnouncement.color} text-white transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left side - Announcement */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Navigation arrows */}
            <button 
              onClick={prevSlide}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Icon and text */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${currentAnnouncement.bgColor} ${currentAnnouncement.textColor}`}>
                {currentAnnouncement.icon}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`${currentAnnouncement.bgColor} ${currentAnnouncement.textColor} px-3 py-1 rounded-full text-xs font-bold`}>
                  {currentAnnouncement.badge}
                </span>
                
                <p className="text-sm md:text-base font-medium hidden sm:block">
                  {currentAnnouncement.text}
                </p>
                
                <p className="text-sm md:text-base font-medium block sm:hidden truncate max-w-[200px]">
                  {currentAnnouncement.text.length > 40 
                    ? currentAnnouncement.text.substring(0, 40) + '...' 
                    : currentAnnouncement.text}
                </p>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="hidden md:flex items-center space-x-1 ml-4">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Aller à l'annonce ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right side - Contact & Actions */}
          <div className="flex items-center space-x-6">
            {/* Contact info - Desktop only */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">01 23 45 67 89</span>
              </div>
              
              <button className="text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full transition-colors">
                En savoir plus
              </button>
            </div>

            {/* Next arrow and close */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={nextSlide}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={closeBanner}
                className="p-1 rounded-full hover:bg-white/20 transition-colors ml-2"
                aria-label="Fermer la bannière"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile contact info */}
        <div className="lg:hidden mt-2 pt-2 border-t border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">01 23 45 67 89</span>
            </div>
            <button className="text-sm underline hover:no-underline">
              Contact rapide
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5">
        <div 
          className="h-full bg-white transition-all duration-5000 ease-linear"
          style={{ 
            width: '100%',
            animation: 'progress 5s linear forwards',
            animationPlayState: 'running'
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
