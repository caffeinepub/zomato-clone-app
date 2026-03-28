import { Heart } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import type { Restaurant } from "../../types";

interface FavoritesPageProps {
  onRestaurantClick: (r: Restaurant) => void;
}

export function FavoritesPage({ onRestaurantClick }: FavoritesPageProps) {
  const {
    favorites,
    favoriteDishes,
    toggleFavorite,
    toggleFavoriteDish,
    restaurants,
    menuItems,
  } = useApp();

  const favoriteRestaurants = restaurants.filter((r) =>
    favorites.includes(r.id),
  );
  const favoriteDishItems = menuItems.filter((m) =>
    favoriteDishes.includes(m.id),
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-5"
        style={{
          background: "linear-gradient(135deg,#1a6b55 0%,#0f4f40 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-red-400 fill-red-400" />
          <h2 className="text-white font-black text-xl">Favourites</h2>
        </div>
        <p className="text-white/70 text-xs mt-1">
          {favoriteRestaurants.length} restaurants · {favoriteDishItems.length}{" "}
          dishes saved
        </p>
      </div>

      <div className="px-4 -mt-4">
        {/* Favourite Restaurants */}
        <div className="mb-5">
          <h3 className="font-black text-sm text-gray-700 tracking-wider mb-3 mt-5">
            SAVED RESTAURANTS
          </h3>
          {favoriteRestaurants.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-8 text-center shadow-sm"
              data-ocid="favorites.restaurants.empty_state"
            >
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-gray-400 text-sm">No saved restaurants yet</p>
              <p className="text-gray-300 text-xs mt-1">
                Tap ❤️ on any restaurant to save it
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {favoriteRestaurants.map((r, idx) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  data-ocid={`favorites.restaurants.item.${idx + 1}`}
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
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-32 bg-gradient-to-br ${r.imageColor} flex items-center justify-center text-5xl`}
                      >
                        {r.imageEmoji ?? "🍴"}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900">
                            {r.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.cuisineType}
                          </p>
                          <p className="text-xs text-gray-400">
                            {r.deliveryTime} · {r.distance ?? "2 km"}
                          </p>
                        </div>
                        <div className="rating-badge ml-2">{r.rating} ★</div>
                      </div>
                      {r.offer && (
                        <div className="mt-2 bg-blue-50 rounded-lg px-2 py-1">
                          <span className="text-blue-700 text-xs font-semibold">
                            {r.offer}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="px-3 pb-3">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(r.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold"
                      data-ocid={`favorites.restaurants.delete_button.${idx + 1}`}
                    >
                      <Heart size={13} className="fill-red-400" />
                      Remove from Favourites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favourite Dishes */}
        <div className="mb-6">
          <h3 className="font-black text-sm text-gray-700 tracking-wider mb-3">
            SAVED DISHES
          </h3>
          {favoriteDishItems.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-8 text-center shadow-sm"
              data-ocid="favorites.dishes.empty_state"
            >
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-gray-400 text-sm">No saved dishes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoriteDishItems.map((dish, idx) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  data-ocid={`favorites.dishes.item.${idx + 1}`}
                >
                  <div
                    className={`w-full h-24 bg-gradient-to-br ${dish.imageColor} flex items-center justify-center text-4xl`}
                  >
                    {dish.isVeg !== false ? "🌿" : "🍗"}
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-xs text-gray-900 truncate">
                      {dish.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {dish.restaurantName}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{dish.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteDish(dish.id)}
                        className="text-red-400"
                        data-ocid={`favorites.dishes.delete_button.${idx + 1}`}
                      >
                        <Heart size={14} className="fill-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 px-4">
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
