import { ClipboardList, Home, ShoppingCart, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  cartCount,
}: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex z-50 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors relative ${
              isActive ? "text-green-600" : "text-gray-400"
            }`}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.id === "cart" && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium ${isActive ? "text-green-600" : "text-gray-400"}`}
            >
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
