import { 
  PlusCircleIcon,
  EyeIcon,
  ChartBarIcon,
  CogIcon 
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ setActiveTab }) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: PlusCircleIcon,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      label: "Ajouter produit",
      onClick: () => navigate("/vendor/add-product")
    },
    {
      icon: EyeIcon,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      label: "Voir boutique",
      onClick: () => window.open(`/store/${vendorId}`, '_blank')
    },
    {
      icon: ChartBarIcon,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      label: "Rapports",
      onClick: () => setActiveTab("analytics")
    },
    {
      icon: CogIcon,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      label: "Paramètres",
      onClick: () => setActiveTab("settings")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
          onClick={action.onClick}
        >
          <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
            <action.icon className={`h-6 w-6 ${action.iconColor}`} />
          </div>
          <span className="font-medium text-gray-900">{action.label}</span>
        </button>
      ))}
    </div>
  );
}