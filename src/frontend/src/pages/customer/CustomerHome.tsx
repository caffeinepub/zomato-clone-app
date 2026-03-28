import { Bell, Heart, Mic, Search, X } from "lucide-react";
import { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { useApp } from "../../contexts/AppContext";
import { FOOD_CATEGORIES } from "../../data/sampleData";
import type { Restaurant } from "../../types";

interface CustomerHomeProps {
  onRestaurantClick: (r: Restaurant) => void;
  onSearchOpen: () => void;
}

const PROMO_BANNERS = [
  {
    id: 1,
    bg: "from-teal-600 to-teal-500",
    tag: "🎖️ IPL MATCH OFFERS",
    title: "UNLOCK MATCH OFFERS",
    sub: "TAP TO UNLOCK DEALS",
    cities: ["Bangalore", "Hyderabad", "Mumbai"],
  },
  {
    id: 2,
    bg: "from-orange-500 to-red-500",
    tag: "🔥 TRENDING NOW",
    title: "UP TO 60% OFF",
    sub: "On your favourite restaurants",
    cities: ["Delhi", "Pune", "Chennai"],
  },
];

const EXPLORE_MORE = [
  { icon: "💰", label: "Offers", color: "bg-blue-50" },
  { icon: "⭐", label: "Top 10", color: "bg-yellow-50" },
  { icon: "🚂", label: "Food on train", color: "bg-green-50" },
  { icon: "🍔", label: "Collections", color: "bg-red-50" },
];

type DietaryFilter = "all" | "veg" | "nonveg" | "vegan";

export function CustomerHome({
  onRestaurantClick,
  onSearchOpen,
}: CustomerHomeProps) {
  const {
    currentUser,
    restaurants,
    favorites,
    toggleFavorite,
    notifications,
    markAllNotificationsRead,
    darkMode,
  } = useApp();
  const [vegMode, setVegMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [promoBanner, setPromoBanner] = useState(0);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>("all");
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const approvedRestaurants = restaurants.filter(
    (r) => r.isApproved && r.isActive,
  );

  let filteredRestaurants = vegMode
    ? approvedRestaurants.filter((r) => r.isPureVeg)
    : approvedRestaurants;

  if (dietaryFilter === "veg") {
    filteredRestaurants = filteredRestaurants.filter((r) => r.isPureVeg);
  } else if (dietaryFilter === "nonveg") {
    filteredRestaurants = filteredRestaurants.filter((r) => !r.isPureVeg);
  } else if (dietaryFilter === "vegan") {
    filteredRestaurants = filteredRestaurants.filter((r) => r.isPureVeg);
  }

  const catFiltered =
    activeCategory === "all"
      ? filteredRestaurants
      : filteredRestaurants.filter((r) =>
          r.cuisineType.toLowerCase().includes(activeCategory.toLowerCase()),
        );

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) ?? "A";

  const banner = PROMO_BANNERS[promoBanner];

  const openNotifications = () => {
    setShowNotifications(true);
    markAllNotificationsRead();
  };

  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-500";

  return (
    <div
      className={`flex-1 overflow-y-auto ${bg}`}
      style={{ paddingBottom: "80px" }}
    >
      {/* Teal Header */}
      <div
        className="px-4 pt-10 pb-16"
        style={{
          background: "linear-gradient(135deg, #1a6b55 0%, #0f4f40 100%)",
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">📍</span>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white font-bold text-base leading-tight">
                  Home
                </span>
                <span className="text-white/80 text-xs">▾</span>
              </div>
              <p className="text-white/70 text-[11px] leading-none">
                12 MG Road, Bangalore
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Gold badge */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "#D4A017", color: "#000" }}
            >
              <span>👑</span>
              <span>GOLD ₹1</span>
            </div>
            {/* Notification bell */}
            <button
              type="button"
              className="relative text-white"
              onClick={openNotifications}
              data-ocid="home.notifications.button"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "#E23744" }}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="w-full bg-white rounded-xl flex items-center gap-2 px-3 py-2.5 shadow-sm"
          data-ocid="home.search_input"
        >
          <Search size={16} className="text-gray-400" />
          <span className="flex-1 text-sm text-gray-400 text-left">
            Search &apos;pizza&apos;
          </span>
          <Mic size={16} className="text-gray-400" />
        </button>

        {/* Veg mode toggle */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/80 text-xs font-medium">VEG MODE</span>
          <Switch
            checked={vegMode}
            onCheckedChange={setVegMode}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      {/* Content pulled up */}
      <div className="-mt-10 px-4">
        {/* Veg mode banner */}
        {vegMode && (
          <div className="mb-3 bg-green-100 border border-green-300 rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="text-green-700 text-xs font-semibold">
              🌿 Veg Mode is ON — showing only pure veg restaurants
            </span>
            <button
              type="button"
              onClick={() => setVegMode(false)}
              className="ml-auto text-green-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Promo banner */}
        <div
          className={`rounded-2xl p-4 mb-4 bg-gradient-to-r ${banner.bg} relative overflow-hidden shadow-md`}
        >
          <div className="absolute right-3 bottom-0 text-5xl opacity-20">
            🏆
          </div>
          <p className="text-white/90 text-[10px] font-semibold tracking-wider mb-1">
            {banner.tag}
          </p>
          <h3 className="text-white font-black text-lg leading-tight mb-1">
            {banner.title}
          </h3>
          <p className="text-white/80 text-xs mb-3">{banner.sub}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-white text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full"
              data-ocid="home.primary_button"
            >
              TAP TO UNLOCK
            </button>
            <div className="flex gap-1">
              {PROMO_BANNERS.map((bnr, i) => (
                <button
                  key={bnr.id}
                  type="button"
                  onClick={() => setPromoBanner(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === promoBanner ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {banner.cities.map((c) => (
              <span
                key={c}
                className="bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Dietary filter chips */}
        <div className="flex gap-2 mb-3">
          {(
            [
              { id: "all", label: "All 🍽️" },
              { id: "veg", label: "Veg 🌱" },
              { id: "nonveg", label: "Non-Veg 🍗" },
              { id: "vegan", label: "Vegan 🥗" },
            ] as { id: DietaryFilter; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDietaryFilter(f.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                dietaryFilter === f.id
                  ? "bg-green-600 text-white shadow-sm"
                  : `${cardBg} border border-gray-200 ${textSecondary}`
              }`}
              data-ocid={`home.dietary.${f.id}.tab`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Food categories */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              BEST OFFERS APPLIED
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {FOOD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                    activeCategory === cat.id
                      ? "shadow-md scale-105"
                      : `${cardBg} shadow-sm`
                  }`}
                  style={
                    activeCategory === cat.id
                      ? { background: "#FFF0F1", outline: "2px solid #E23744" }
                      : {}
                  }
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    activeCategory === cat.id ? "text-red-500" : textSecondary
                  }`}
                >
                  {cat.label}
                </span>
                {activeCategory === cat.id && (
                  <div
                    className="w-4 h-0.5 rounded-full"
                    style={{ background: "#E23744" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
          {["Filters ▾", "Near & Fast", "Under ₹150", "Sort"].map((chip) => (
            <button
              key={chip}
              type="button"
              className={`flex-shrink-0 ${cardBg} border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium ${textSecondary} shadow-xs`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Explore More */}
        <div className="mb-4">
          <h3
            className={`font-black text-sm ${textPrimary} tracking-wider mb-2`}
          >
            EXPLORE MORE
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {EXPLORE_MORE.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`${item.color} rounded-2xl py-3 flex flex-col items-center gap-1.5 shadow-xs`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-semibold text-gray-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* In the Spotlight */}
        <div className="mb-4">
          <h3
            className={`font-black text-sm ${textPrimary} tracking-wider mb-2`}
          >
            IN THE SPOTLIGHT
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {approvedRestaurants.slice(0, 6).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onRestaurantClick(r)}
                className={`flex-shrink-0 w-44 ${cardBg} rounded-2xl overflow-hidden shadow-sm text-left`}
              >
                <div className="relative">
                  {r.heroImage ? (
                    <img
                      src={r.heroImage}
                      alt={r.name}
                      className="w-44 h-28 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-44 h-28 bg-gradient-to-br ${r.imageColor} flex items-center justify-center text-5xl`}
                    >
                      {r.imageEmoji ?? "🍴"}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(r.id);
                    }}
                    className="absolute top-2 right-2"
                    data-ocid="home.spotlight.favorite.toggle"
                  >
                    <Heart
                      size={18}
                      className={
                        favorites.includes(r.id)
                          ? "fill-red-500 stroke-red-500"
                          : "fill-white/60 stroke-white"
                      }
                    />
                  </button>
                  <div className="rating-badge absolute bottom-2 left-2">
                    {r.rating} ★
                  </div>
                </div>
                <div className="p-2">
                  <p className={`font-bold text-xs ${textPrimary} truncate`}>
                    {r.name}
                  </p>
                  <p className={`text-[10px] ${textSecondary}`}>
                    {r.deliveryTime} · {r.distance ?? "2 km"}
                  </p>
                  {r.offer && (
                    <p
                      className="text-[10px] font-semibold mt-0.5"
                      style={{ color: "#3D9B41" }}
                    >
                      {r.offer}
                    </p>
                  )}
                  {r.isPureVeg && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded mt-0.5">
                      🌿 Pure Veg
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All Restaurants */}
        <div className="mb-4">
          <h3
            className={`font-black text-sm ${textPrimary} tracking-wider mb-3`}
          >
            ALL RESTAURANTS ({catFiltered.length})
          </h3>
          <div className="flex flex-col gap-3">
            {catFiltered.map((r, idx) => (
              <div
                key={r.id}
                className={`${cardBg} rounded-2xl overflow-hidden shadow-sm relative`}
                data-ocid={`restaurants.item.${idx + 1}`}
              >
                <button
                  type="button"
                  onClick={() => onRestaurantClick(r)}
                  className="w-full text-left"
                >
                  {r.heroImage ? (
                    <img
                      src={r.heroImage}
                      alt={r.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-40 bg-gradient-to-br ${r.imageColor} flex items-center justify-center text-7xl`}
                    >
                      {r.imageEmoji ?? "🍴"}
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm ${textPrimary}`}>
                            {r.name}
                          </p>
                          {r.isPureVeg && (
                            <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                              PURE VEG
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${textSecondary} mt-0.5`}>
                          {r.cuisineType}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>
                          {r.deliveryTime} · {r.distance ?? "2 km"} · ₹
                          {r.minOrder} min order
                        </p>
                      </div>
                      <div className="rating-badge ml-2 flex-shrink-0">
                        {r.rating} ★
                      </div>
                    </div>
                    {r.offer && (
                      <div className="mt-2 flex items-center gap-1.5 bg-blue-50 rounded-lg px-2 py-1.5">
                        <span className="text-blue-500 text-xs">⚙️</span>
                        <span className="text-blue-700 text-xs font-semibold">
                          {r.offer}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
                {/* Heart button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(r.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                  data-ocid={`restaurants.item.${idx + 1}.toggle`}
                >
                  <Heart
                    size={15}
                    className={
                      favorites.includes(r.id)
                        ? "fill-red-500 stroke-red-500"
                        : "stroke-gray-400"
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-4">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Notifications bottom sheet */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setShowNotifications(false)}
          />
          <div
            className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-[430px] w-full mx-auto"
            data-ocid="notifications.modal"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-gray-900">
                Notifications
              </h3>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-gray-400"
                data-ocid="notifications.close_button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl ${
                    n.read
                      ? "bg-gray-50"
                      : "bg-green-50 border border-green-100"
                  }`}
                >
                  <span className="text-xl flex-shrink-0">
                    {n.icon ?? "🔔"}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-xs font-medium ${n.read ? "text-gray-500" : "text-gray-800"}`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(n.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
