import {
  ClipboardList,
  Home,
  ShoppingCart,
  User,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CartPage } from "./pages/customer/CartPage";
import { CustomerHome } from "./pages/customer/CustomerHome";
import { OrdersPage } from "./pages/customer/OrdersPage";
import { ProfilePage } from "./pages/customer/ProfilePage";
import { RestaurantDetail } from "./pages/customer/RestaurantDetail";
import { SearchPage } from "./pages/customer/SearchPage";
import { DeliveryDashboard } from "./pages/delivery/DeliveryDashboard";
import { RestaurantDashboard } from "./pages/restaurant/RestaurantDashboard";
import { SponsorDashboard } from "./pages/sponsor/SponsorDashboard";
import { SuperAdminDashboard } from "./pages/superadmin/SuperAdminDashboard";
import type { Restaurant } from "./types";

type CustomerScreen =
  | "home"
  | "search"
  | "restaurant"
  | "cart"
  | "orders"
  | "profile";

function CustomerBottomNav({
  activeTab,
  onTabChange,
  cartCount,
}: {
  activeTab: string;
  onTabChange: (t: string) => void;
  cartCount: number;
}) {
  const tabs = [
    { id: "home", label: "Delivery", icon: Home },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40">
      <div className="mx-3 mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 relative transition-colors ${isActive ? "text-green-600" : "text-gray-400"}`}
              data-ocid={`nav.${tab.id}.link`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-green-600" : "text-gray-400"}`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-green-500" />
              )}
            </button>
          );
        })}
        {/* Blinkit yellow button */}
        <div className="flex items-center px-2">
          <button
            type="button"
            className="flex flex-col items-center px-3 py-1.5 rounded-xl text-black font-bold text-[10px] gap-0.5"
            style={{ background: "#FFE000" }}
          >
            <span className="text-lg leading-none">⚡</span>
            <span>Blinkit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const { currentUser, cart } = useApp();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [screen, setScreen] = useState<CustomerScreen>("home");

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  if (!currentUser) return <LoginPage />;

  const role = currentUser.role;

  if (role === "restaurant_owner")
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
        <RestaurantDashboard />
      </div>
    );
  if (role === "delivery_partner")
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
        <DeliveryDashboard />
      </div>
    );
  if (role === "sponsor")
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
        <SponsorDashboard />
      </div>
    );
  if (role === "admin")
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
        <AdminDashboard />
      </div>
    );
  if (role === "super_admin")
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
        <SuperAdminDashboard />
      </div>
    );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setScreen(tab as CustomerScreen);
    setSelectedRestaurant(null);
  };

  const handleRestaurantClick = (r: Restaurant) => {
    setSelectedRestaurant(r);
    setScreen("restaurant");
  };

  const handleSearchOpen = () => {
    setScreen("search");
  };

  const activeScreen = screen;

  return (
    <div className="flex flex-col min-h-screen max-w-[430px] mx-auto bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeScreen === "home" && (
          <CustomerHome
            onRestaurantClick={handleRestaurantClick}
            onSearchOpen={handleSearchOpen}
          />
        )}
        {activeScreen === "search" && (
          <SearchPage
            onBack={() => {
              setScreen("home");
              setActiveTab("home");
            }}
            onRestaurantClick={handleRestaurantClick}
          />
        )}
        {activeScreen === "restaurant" && selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={() => {
              setScreen("home");
              setActiveTab("home");
            }}
            onViewCart={() => {
              setScreen("cart");
              setActiveTab("cart");
            }}
          />
        )}
        {activeScreen === "cart" && (
          <CartPage
            onBack={() => {
              setScreen("home");
              setActiveTab("home");
            }}
            onOrderPlaced={() => {
              setScreen("orders");
              setActiveTab("orders");
            }}
          />
        )}
        {activeScreen === "orders" && <OrdersPage />}
        {activeScreen === "profile" && <ProfilePage />}
      </div>
      {activeScreen !== "search" && activeScreen !== "restaurant" && (
        <CustomerBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={cartCount}
        />
      )}
      {activeScreen === "restaurant" && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none">
          <div className="mx-3 mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden pointer-events-auto">
            {[
              { id: "home", label: "Delivery", icon: Home },
              { id: "orders", label: "Orders", icon: ClipboardList },
              { id: "cart", label: "Cart", icon: ShoppingCart },
              { id: "profile", label: "Profile", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-gray-400"
                  data-ocid={`nav.${tab.id}.link`}
                >
                  <div className="relative">
                    <Icon size={20} strokeWidth={1.8} />
                    {tab.id === "cart" && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </button>
              );
            })}
            <div className="flex items-center px-2">
              <button
                type="button"
                className="flex flex-col items-center px-3 py-1.5 rounded-xl text-black font-bold text-[10px] gap-0.5"
                style={{ background: "#FFE000" }}
              >
                <span className="text-lg leading-none">⚡</span>
                <span>Blinkit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
