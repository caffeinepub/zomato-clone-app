import {
  ArrowLeft,
  Clock,
  Heart,
  Info,
  Minus,
  MoreVertical,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import type { MenuItem, Restaurant } from "../../types";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onViewCart: () => void;
}

function VegDot({ isVeg }: { isVeg?: boolean }) {
  return isVeg === false ? (
    <span className="nonveg-dot" />
  ) : (
    <span className="veg-dot" />
  );
}

type FilterModal = "filters" | "schedule" | null;
type DietaryFilter = "all" | "veg" | "nonveg" | "vegan";

export function RestaurantDetail({
  restaurant,
  onBack,
  onViewCart,
}: RestaurantDetailProps) {
  const {
    menuItems,
    cart,
    addToCart,
    updateCartQty,
    favorites,
    toggleFavorite,
    reviews,
  } = useApp();
  const [filterModal, setFilterModal] = useState<FilterModal>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>("all");

  const items = menuItems.filter((m) => m.restaurantId === restaurant.id);
  const categories = [...new Set(items.map((m) => m.category))];

  const restaurantCartItems = cart.filter(
    (c) => c.menuItem.restaurantId === restaurant.id,
  );
  const restaurantCartCount = restaurantCartItems.reduce(
    (s, c) => s + c.quantity,
    0,
  );

  const getCartQty = (itemId: string) =>
    cart.find((c) => c.menuItem.id === itemId)?.quantity ?? 0;

  const filteredItems = (catItems: MenuItem[]) => {
    let result = catItems;
    if (activeFilter === "veg")
      result = result.filter((i) => i.isVeg !== false);
    if (activeFilter === "reordered")
      result = result.filter((i) => i.isHighlyReordered);
    // dietary filter
    if (dietaryFilter === "veg")
      result = result.filter(
        (i) => i.dietaryType === "veg" || i.isVeg !== false,
      );
    if (dietaryFilter === "nonveg")
      result = result.filter(
        (i) => i.dietaryType === "nonveg" || i.isVeg === false,
      );
    if (dietaryFilter === "vegan")
      result = result.filter((i) => i.dietaryType === "vegan");
    return result;
  };

  const suggestions = menuItems
    .filter((m) => m.restaurantId !== restaurant.id)
    .slice(0, 6);

  const restaurantReviews = reviews.filter(
    (r) => r.restaurantId === restaurant.id,
  );
  const avgRating = restaurantReviews.length
    ? restaurantReviews.reduce((s, r) => s + r.rating, 0) /
      restaurantReviews.length
    : restaurant.rating;
  const isFav = favorites.includes(restaurant.id);

  return (
    <div
      className="flex-1 flex flex-col bg-white relative"
      style={{ paddingBottom: "140px" }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
          data-ocid="restaurant.back_button"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <Search size={15} className="text-gray-400" />
          <span className="text-sm text-gray-400">Search in menu</span>
        </div>
        {/* Favorite button in header */}
        <button
          type="button"
          onClick={() => toggleFavorite(restaurant.id)}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
          data-ocid="restaurant.favorite.toggle"
        >
          <Heart
            size={16}
            className={
              isFav ? "fill-red-500 stroke-red-500" : "stroke-gray-500"
            }
          />
        </button>
        <button type="button">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Restaurant hero */}
        {restaurant.heroImage ? (
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div
            className={`w-full h-44 bg-gradient-to-br ${restaurant.imageColor} flex items-center justify-center text-8xl`}
          >
            {restaurant.imageEmoji ?? "🍴"}
          </div>
        )}

        {/* Restaurant info */}
        <div className="px-4 py-4 border-b border-gray-100">
          {restaurant.isPureVeg && (
            <div className="flex items-center gap-1 mb-2">
              <span className="veg-dot" />
              <span className="text-green-700 text-xs font-bold">Pure Veg</span>
            </div>
          )}
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex-1 pr-2">
              {restaurant.name}
            </h1>
            <Info size={18} className="text-gray-400 mt-1 flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {restaurant.cuisineType}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="rating-badge">{avgRating.toFixed(1)} ★</span>
            <span className="text-xs text-blue-600 underline font-medium">
              {restaurantReviews.length > 0
                ? `${restaurantReviews.length + 200}+ ratings`
                : "200+ ratings"}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <span>{restaurant.locality ?? restaurant.address}</span>
            <span>·</span>
            <span>{restaurant.distance ?? "2 km"}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setFilterModal("schedule")}
              className="flex items-center gap-1 text-xs text-gray-600"
              data-ocid="restaurant.schedule_button"
            >
              <Clock size={12} />
              <span>{restaurant.deliveryTime} · Schedule for later ▾</span>
            </button>
          </div>

          <div className="mt-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              ✓ No packaging charges
            </span>
          </div>
        </div>

        {/* Offer banner */}
        {restaurant.offer && (
          <div
            className="mx-4 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: "#EBF3FF" }}
          >
            <span className="text-blue-500">⚙️</span>
            <div className="flex-1">
              <p className="text-blue-700 text-xs font-bold">
                {restaurant.offer}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCouponOpen(true)}
              className="text-blue-600 text-xs font-semibold"
              data-ocid="restaurant.coupon_button"
            >
              7 offers ▾
            </button>
          </div>
        )}

        {/* Dietary filter chips */}
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-hide">
          {(
            [
              { id: "all", label: "All" },
              { id: "veg", label: "Veg 🌱" },
              { id: "nonveg", label: "Non-Veg 🍗" },
              { id: "vegan", label: "Vegan 🥗" },
            ] as { id: DietaryFilter; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDietaryFilter(f.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                dietaryFilter === f.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600"
              }`}
              data-ocid={`restaurant.dietary.${f.id}.tab`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => setFilterModal("filters")}
            className="flex-shrink-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700"
            data-ocid="restaurant.filters_button"
          >
            Filters ▾
          </button>
          {["Highly reordered 🔄", "Spicy 🌶️"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() =>
                setActiveFilter(
                  f.startsWith("Highly")
                    ? activeFilter === "reordered"
                      ? null
                      : "reordered"
                    : activeFilter === "spicy"
                      ? null
                      : "spicy",
                )
              }
              className={`flex-shrink-0 border rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                (f.startsWith("Highly") && activeFilter === "reordered") ||
                (f.startsWith("Spicy") && activeFilter === "spicy")
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Menu sections */}
        {categories.map((cat) => {
          const catItems = filteredItems(
            items.filter((m) => m.category === cat),
          );
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="mb-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">
                  {cat} ({catItems.length})
                </h3>
                <span className="text-gray-400">▾</span>
              </div>

              {catItems.map((item) => {
                const qty = getCartQty(item.id);
                return (
                  <div
                    key={item.id}
                    className="px-4 py-4 border-b border-gray-50"
                    data-ocid={`menu.item.${item.id}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <VegDot isVeg={item.isVeg} />
                          {item.isHighlyReordered && (
                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                              BESTSELLER
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-gray-900">
                          {item.name}
                        </p>
                        {item.isHighlyReordered && (
                          <div className="flex items-center gap-2 my-1">
                            <div
                              className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden"
                              style={{ maxWidth: 80 }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{ width: "80%", background: "#3D9B41" }}
                              />
                            </div>
                            <span className="text-[9px] text-gray-500">
                              Highly reordered
                            </span>
                          </div>
                        )}
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          ₹{item.price}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-center gap-1">
                        <div
                          className={`w-24 h-20 bg-gradient-to-br ${item.imageColor} rounded-xl flex items-center justify-center text-4xl`}
                        >
                          {item.category === "Pizza"
                            ? "🍕"
                            : item.category === "Burger"
                              ? "🍔"
                              : item.category === "Biryani"
                                ? "🍚"
                                : item.category === "Pasta"
                                  ? "🍝"
                                  : item.category === "Sandwich"
                                    ? "🥪"
                                    : item.category === "Curry"
                                      ? "🍲"
                                      : item.category === "Bread"
                                        ? "🥖"
                                        : item.category === "Dessert"
                                          ? "🍮"
                                          : item.category === "Cake"
                                            ? "🎂"
                                            : item.category === "Breakfast"
                                              ? "🥘"
                                              : item.category === "Starter"
                                                ? "🍿"
                                                : "🍴"}
                        </div>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="add-btn"
                            data-ocid={`menu.${item.id}.button`}
                          >
                            ADD +
                          </button>
                        ) : (
                          <div className="add-btn-active">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, qty - 1)}
                              data-ocid={`menu.${item.id}.toggle`}
                            >
                              <Minus size={12} className="text-white" />
                            </button>
                            <span className="text-white font-bold text-sm">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {qty > 0 && suggestions.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          You will love pairing it with
                        </p>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                          {suggestions.slice(0, 4).map((s) => (
                            <div
                              key={s.id}
                              className="flex-shrink-0 w-24 bg-gray-50 rounded-xl p-2 text-center"
                            >
                              <div className="text-2xl mb-1">
                                {s.category === "Pizza"
                                  ? "🍕"
                                  : s.category === "Burger"
                                    ? "🍔"
                                    : "🍴"}
                              </div>
                              <p className="text-[9px] font-semibold text-gray-700 truncate">
                                {s.name}
                              </p>
                              <p className="text-[9px] text-gray-500">
                                ₹{s.price}
                              </p>
                              <button
                                type="button"
                                onClick={() => addToCart(s)}
                                className="text-[9px] font-bold mt-1 px-2 py-0.5 rounded"
                                style={{
                                  border: "1px solid #3D9B41",
                                  color: "#3D9B41",
                                }}
                              >
                                ADD
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Feature 6: Reviews section */}
        {restaurantReviews.length > 0 && (
          <div className="px-4 py-5 border-t border-gray-100">
            <h3 className="font-black text-sm text-gray-900 mb-3">
              ⭐ Reviews & Ratings
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex gap-0.5 justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= Math.round(avgRating)
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {restaurantReviews.length + 200}+ ratings
                </p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = restaurantReviews.filter(
                    (r) => r.rating === star,
                  ).length;
                  const pct = restaurantReviews.length
                    ? (count / restaurantReviews.length) * 100
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-gray-500 w-3">
                        {star}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3">
              {restaurantReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {review.customerName[0]}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      {review.customerName}
                    </span>
                    <div className="flex gap-0.5 ml-auto">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 stroke-yellow-400"
                              : "stroke-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{review.comment}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Menu button */}
      <div className="fixed bottom-32 right-4 z-20">
        <button
          type="button"
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
        >
          🧔 Menu
        </button>
      </div>

      {/* Bottom sticky bars */}
      {restaurantCartCount > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-30">
          <div
            className="rounded-t-xl px-4 py-2 text-center text-xs font-semibold"
            style={{ background: "#FFF8E1", color: "#E65100" }}
          >
            🔓{" "}
            {restaurant.offer
              ? `Unlock ${restaurant.offer.split("OFF")[0]}OFF`
              : "Unlock offers"}{" "}
            — Add more items
          </div>
          <button
            type="button"
            onClick={onViewCart}
            className="w-full flex items-center justify-between px-4 py-3 text-white font-bold rounded-b-xl shadow-lg"
            style={{ background: "#3D9B41" }}
            data-ocid="restaurant.view_cart_button"
          >
            <span className="text-sm">
              {restaurantCartCount} item{restaurantCartCount > 1 ? "s" : ""}{" "}
              added
            </span>
            <span className="text-sm">View cart ›</span>
          </button>
        </div>
      )}

      {/* Filters modal */}
      {filterModal === "filters" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setFilterModal(null)}
          />
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-[430px] w-full mx-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Filters and Sorting
            </h3>
            <p className="text-xs font-semibold text-gray-500 mb-2">SORT BY</p>
            <div className="flex gap-2 mb-4">
              {["Price - low to high", "Price - high to low"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFilterModal(null)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600"
                data-ocid="restaurant.filters.cancel_button"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setFilterModal(null)}
                className="flex-1 py-3 bg-gray-200 rounded-xl text-sm font-bold text-gray-800"
                data-ocid="restaurant.filters.confirm_button"
              >
                Apply ({items.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule modal */}
      {filterModal === "schedule" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setFilterModal(null)}
          />
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-[430px] w-full mx-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Select your delivery time
            </h3>
            <div className="space-y-2 mb-6">
              {["11:30 AM – 12 PM", "12 – 12:30 PM", "12:30 – 1 PM"].map(
                (slot, i) => (
                  <button
                    key={slot}
                    type="button"
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${
                      i === 0
                        ? "border-green-500 bg-green-50 text-green-800 font-semibold"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <span>{slot}</span>
                    {i === 0 && <span className="text-green-600">✓</span>}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              onClick={() => setFilterModal(null)}
              className="w-full py-3.5 rounded-xl font-bold text-white"
              style={{ background: "#3D9B41" }}
              data-ocid="restaurant.schedule.confirm_button"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Coupon popup */}
      {couponOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setCouponOpen(false)}
          />
          <div
            className="rounded-t-3xl px-5 pt-6 pb-8 max-w-[430px] w-full mx-auto"
            style={{
              background: "linear-gradient(180deg, #E3F0FF 0%, #fff 60%)",
            }}
          >
            <div className="w-10 h-1 bg-blue-200 rounded-full mx-auto mb-5" />
            <h3 className="text-center text-xl font-black text-gray-900 mb-1">
              Save on this order
            </h3>
            <p className="text-center text-sm text-gray-600 mb-5">
              Use codes: SAVE20, FIRST50, WELCOME10, FLAT30
            </p>
            <button
              type="button"
              onClick={() => setCouponOpen(false)}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
              style={{ background: "#3D9B41" }}
              data-ocid="restaurant.coupon.confirm_button"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
