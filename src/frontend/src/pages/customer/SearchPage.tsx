import { ArrowLeft, Mic, Search } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import type { Restaurant } from "../../types";

interface SearchPageProps {
  onBack: () => void;
  onRestaurantClick: (r: Restaurant) => void;
}

const FOOD_PILLS = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "cake", label: "Cake", emoji: "🎂" },
  { id: "burger", label: "Burger", emoji: "🍔" },
  { id: "biryani", label: "Biryani", emoji: "🍚" },
  { id: "sandwich", label: "Sandwich", emoji: "🥪" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "dessert", label: "Dessert", emoji: "🍮" },
];

type DietaryFilter = "all" | "veg" | "nonveg" | "vegan";

export function SearchPage({ onBack, onRestaurantClick }: SearchPageProps) {
  const { restaurants, cart } = useApp();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>("all");

  const approvedRestaurants = restaurants.filter(
    (r) => r.isApproved && r.isActive,
  );

  let filtered = approvedRestaurants.filter((r) => {
    const matchQuery =
      !query ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisineType.toLowerCase().includes(query.toLowerCase());
    const matchCat =
      activeCategory === "all" ||
      r.cuisineType.toLowerCase().includes(activeCategory.toLowerCase());
    return matchQuery && matchCat;
  });

  if (dietaryFilter === "veg") filtered = filtered.filter((r) => r.isPureVeg);
  if (dietaryFilter === "nonveg")
    filtered = filtered.filter((r) => !r.isPureVeg);
  if (dietaryFilter === "vegan") filtered = filtered.filter((r) => r.isPureVeg);

  const recommended = filtered.slice(0, 4);
  const allRestaurants = filtered;

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartRestaurant = cart[0]?.menuItem.restaurantName;

  return (
    <div
      className="flex-1 flex flex-col bg-white"
      style={{ paddingBottom: cartCount > 0 ? "100px" : "20px" }}
    >
      {/* Search bar */}
      <div className="px-4 pt-10 pb-3" style={{ background: "#3D9B41" }}>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5">
          <button type="button" onClick={onBack} data-ocid="search.back_button">
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            className="flex-1 text-sm text-gray-800 outline-none"
            data-ocid="search.search_input"
          />
          <Mic size={15} className="text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Dietary filter */}
        <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide">
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
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                dietaryFilter === f.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600"
              }`}
              data-ocid={`search.dietary.${f.id}.tab`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {FOOD_PILLS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveCategory(p.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === p.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
              data-ocid={`search.${p.id}.tab`}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {["Filters ▾", "Near & Fast", "Under ₹250", "Items with offers"].map(
            (f) => (
              <button
                key={f}
                type="button"
                className="flex-shrink-0 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 bg-white"
              >
                {f}
              </button>
            ),
          )}
        </div>

        {/* Free delivery banner */}
        <div className="mx-4 mb-4 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-blue-500 font-bold text-sm">FREE</span>
          <p className="text-xs font-semibold text-blue-700">
            Delivery — Exclusively for you on your first order
          </p>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mb-4">
            <h3 className="font-black text-xs text-gray-500 tracking-widest px-4 mb-3">
              RECOMMENDED FOR YOU
            </h3>
            <div className="grid grid-cols-2 gap-3 px-4">
              {recommended.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onRestaurantClick(r)}
                  className="rounded-2xl overflow-hidden bg-white shadow-sm text-left"
                  data-ocid={`search.recommended.item.${idx + 1}`}
                >
                  <div className="relative">
                    {r.heroImage ? (
                      <img
                        src={r.heroImage}
                        alt={r.name}
                        className="w-full h-28 object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-28 bg-gradient-to-br ${r.imageColor} flex items-center justify-center text-5xl`}
                      >
                        {r.imageEmoji ?? "🍴"}
                      </div>
                    )}
                    {r.offer && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                        <p className="text-white text-[9px] font-bold">
                          {r.offer}
                        </p>
                      </div>
                    )}
                    <div className="rating-badge absolute top-2 right-2">
                      {r.rating} ★
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-xs text-gray-900 truncate">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {r.deliveryTime}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All restaurants */}
        <div className="px-4">
          <h3 className="font-black text-xs text-gray-500 tracking-widest mb-3">
            ALL RESTAURANTS ({allRestaurants.length})
          </h3>
          {allRestaurants.length === 0 ? (
            <div className="text-center py-12" data-ocid="search.empty_state">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-500 font-semibold">
                No restaurants found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allRestaurants.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onRestaurantClick(r)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm text-left"
                  data-ocid={`search.item.${idx + 1}`}
                >
                  <div className="relative">
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
                    {r.offer && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                        <p className="text-white text-xs font-semibold">
                          {r.offer}
                        </p>
                      </div>
                    )}
                  </div>
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
                          {r.deliveryTime} · {r.distance ?? "2 km"}
                        </p>
                      </div>
                      <div className="rating-badge ml-2 flex-shrink-0">
                        {r.rating} ★
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-4 z-30">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center px-4 py-3 gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500">{cartRestaurant}</p>
              <button
                type="button"
                className="text-xs font-semibold"
                style={{ color: "#3D9B41" }}
              >
                View Menu
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs"
              style={{ background: "#3D9B41" }}
              data-ocid="search.cart_button"
            >
              View Cart {cartCount} item{cartCount > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
