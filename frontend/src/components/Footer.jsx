export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-bold text-white mb-2">PEMTShop</h3>
          <p>Plateforme e-commerce multi-tenant</p>
        </div>
        <div>
          <p>À propos</p>
          <p>Conditions</p>
          <p>Confidentialité</p>
        </div>
        <div>
          <p>Support</p>
          <p>Contact</p>
          <p>Aide</p>
        </div>
      </div>
      <div className="text-center text-xs py-3 border-t border-gray-700">
        © 2026 PEMTShop – Tous droits réservés
      </div>
    </footer>
  );
}
