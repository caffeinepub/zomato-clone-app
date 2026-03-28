import { Mic, Search, Wallet, X } from "lucide-react";
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
    tag: "🏅 IPL MATCH OFFERS",
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

export function CustomerHome({
  onRestaurantClick,
  onSearchOpen,
}: CustomerHomeProps) {
  const { currentUser, restaurants } = useApp();
  const [vegMode, setVegMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [promoBanner, setPromoBanner] = useState(0);

  const approvedRestaurants = restaurants.filter(
    (r) => r.isApproved && r.isActive,
  );
  const filteredRestaurants = vegMode
    ? approvedRestaurants.filter((r) => r.isPureVeg)
    : approvedRestaurants;

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

  return (
    <div
      className="flex-1 overflow-y-auto bg-gray-50"
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
            <button type="button" className="text-white">
              <Wallet size={20} />
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

      {/* Content pulled up to overlap header */}
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
                      : "bg-white shadow-sm"
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
                    activeCategory === cat.id ? "text-red-500" : "text-gray-600"
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
              className="flex-shrink-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Explore More */}
        <div className="mb-4">
          <h3 className="font-black text-sm text-gray-700 tracking-wider mb-2">
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
          <h3 className="font-black text-sm text-gray-700 tracking-wider mb-2">
            IN THE SPOTLIGHT
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {approvedRestaurants.slice(0, 6).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onRestaurantClick(r)}
                className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm text-left"
              >
                {/* Food image */}
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
                    className="absolute top-2 right-2 text-white"
                  >
                    🔖
                  </button>
                  <div className="rating-badge absolute bottom-2 left-2">
                    {r.rating} ★
                  </div>
                </div>
                <div className="p-2">
                  <p className="font-bold text-xs text-gray-900 truncate">
                    {r.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
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
          <h3 className="font-black text-sm text-gray-700 tracking-wider mb-3">
            ALL RESTAURANTS ({catFiltered.length})
          </h3>
          <div className="flex flex-col gap-3">
            {catFiltered.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onRestaurantClick(r)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm text-left"
                data-ocid={`restaurants.item.${idx + 1}`}
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
                        <p className="font-bold text-sm text-gray-900">
                          {r.name}
                        </p>
                        {r.isPureVeg && (
                          <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                            PURE VEG
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {r.cuisineType}
                      </p>
                      <p className="text-xs text-gray-400">
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
    </div>
  );
}
