import {
  ArrowLeft,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import type { MenuItem } from "../../types";

interface ProductDetailProps {
  item: MenuItem;
  onBack: () => void;
  onCartOpen: () => void;
}

export function ProductDetail({
  item,
  onBack,
  onCartOpen,
}: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const { addToCart, cart } = useApp();

  const totalTime = item.prepTime + item.cookingTime;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const handleAddToCart = () => {
    addToCart(item, qty);
    onCartOpen();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero Image */}
      <div
        className={`relative h-64 bg-gradient-to-br ${item.imageColor} flex items-center justify-center`}
      >
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        {cartCount > 0 && (
          <button
            type="button"
            onClick={onCartOpen}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm relative"
          >
            <ShoppingCart size={20} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>
        )}
        <span className="text-8xl">
          {item.category === "Biryani"
            ? "🍚"
            : item.category === "Pizza"
              ? "🍕"
              : item.category === "Burger"
                ? "🍔"
                : item.category === "Dessert" || item.category === "Ice Cream"
                  ? "🍦"
                  : item.category === "Noodles"
                    ? "🍜"
                    : "🍽️"}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900 flex-1 pr-3">
            {item.name}
          </h1>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-xl">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-800">
              {item.rating}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{item.restaurantName}</p>

        {/* Time Badges */}
        <div className="flex gap-2 mb-4">
          {[
            { label: "Prep Time", value: `${item.prepTime} Min` },
            { label: "Cooking", value: `${item.cookingTime} Min` },
            { label: "Total Time", value: `${totalTime} Min` },
          ].map((t) => (
            <div
              key={t.label}
              className="flex-1 bg-gray-50 rounded-2xl p-2.5 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={12} className="text-green-600" />
                <span className="text-[10px] text-gray-500">{t.label}</span>
              </div>
              <p className="text-xs font-bold text-gray-900">{t.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-1.5">Description</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Nutrition */}
        <div className="mb-5">
          <h3 className="font-semibold text-gray-900 mb-2">Nutrition Info</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                label: "Carbs",
                value: `${item.nutrition.carbs}g`,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Calories",
                value: `${item.nutrition.calories}kcal`,
                color: "bg-orange-50 text-orange-700",
              },
              {
                label: "Protein",
                value: `${item.nutrition.protein}g`,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Fat",
                value: `${item.nutrition.fat}g`,
                color: "bg-red-50 text-red-700",
              },
            ].map((n) => (
              <div
                key={n.label}
                className={`${n.color} rounded-2xl p-2 text-center`}
              >
                <p className="text-[10px] font-medium opacity-70">{n.label}</p>
                <p className="text-xs font-bold mt-0.5">{n.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{item.price * qty}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-bold w-5 text-center">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center"
            >
              <Plus size={16} className="text-white" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-green-600 text-white font-bold text-sm px-5 py-3 rounded-2xl hover:bg-green-700 transition-colors shadow-sm"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
