import {
  DollarSign,
  Edit2,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

export function RestaurantDashboard() {
  const { currentUser, menuItems, orders, login } = useApp();
  const [activeTab, setActiveTab] = useState<"dashboard" | "menu" | "orders">(
    "dashboard",
  );
  const [showForm, setShowForm] = useState(false);

  const myRestaurantId = "r1";
  const myItems = menuItems.filter((i) => i.restaurantId === myRestaurantId);
  const myOrders = orders.filter((o) => o.restaurantId === myRestaurantId);
  const revenue = myOrders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.totalAmount, 0);

  const STATUS_ACTIONS: Record<string, string> = {
    pending: "Confirm",
    confirmed: "Start Preparing",
    preparing: "Mark Ready",
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-5 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-white/80 text-xs">Restaurant Owner</p>
            <h2 className="text-white font-bold text-lg">
              {currentUser?.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              login(SAMPLE_USERS.find((u) => u.role === "customer")!)
            }
            className="text-white/80 text-xs bg-white/20 px-3 py-1.5 rounded-full"
          >
            Switch Role
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {(["dashboard", "menu", "orders"] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: ShoppingBag,
                  label: "Total Orders",
                  value: myOrders.length,
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  icon: DollarSign,
                  label: "Revenue",
                  value: `₹${revenue}`,
                  color: "bg-green-50 text-green-600",
                },
                {
                  icon: UtensilsCrossed,
                  label: "Menu Items",
                  value: myItems.length,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: Star,
                  label: "Avg Rating",
                  value: "4.6",
                  color: "bg-yellow-50 text-yellow-600",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`${stat.color} rounded-2xl p-4`}
                  >
                    <Icon size={20} className="mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">Recent Orders</h3>
              {myOrders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="flex justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {o.items[0]?.name}
                      {o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.deliveryAddress.split(",")[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{o.totalAmount}
                    </p>
                    <p className="text-xs text-orange-600 capitalize">
                      {o.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="w-full mb-4 border-2 border-dashed border-orange-300 text-orange-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50"
            >
              <Plus size={18} /> Add New Item
            </button>
            {showForm && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <p className="font-semibold text-gray-900 mb-3">
                  Add Menu Item
                </p>
                {["Item Name", "Category", "Price (₹)", "Description"].map(
                  (field) => (
                    <input
                      key={field}
                      placeholder={field}
                      className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
                    />
                  ),
                )}
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm mt-1"
                >
                  Save Item
                </button>
              </div>
            )}
            <div className="space-y-3">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-50"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.imageColor} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    🍽️
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.category} • ₹{item.price}
                    </p>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${item.isAvailable ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <button type="button" className="text-blue-400">
                      <Edit2 size={15} />
                    </button>
                    <button type="button" className="text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-sm text-gray-900">
                    Order #{order.id.slice(-4)}
                  </p>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full capitalize">
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {order.items
                    .map((i) => `${i.name} x${i.quantity}`)
                    .join(", ")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                  {STATUS_ACTIONS[order.status] && (
                    <button
                      type="button"
                      className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-xl font-medium"
                    >
                      {STATUS_ACTIONS[order.status]}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
