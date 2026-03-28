import {
  CheckCircle,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

export function AdminDashboard() {
  const {
    currentUser,
    restaurants,
    orders,
    approveRestaurant,
    suspendRestaurant,
    login,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    "overview" | "restaurants" | "users"
  >("overview");

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/60 text-xs">Admin Panel</p>
            <h2 className="text-white font-bold text-lg">
              {currentUser?.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              login(SAMPLE_USERS.find((u) => u.role === "customer")!)
            }
            className="text-white/70 text-xs bg-white/10 px-3 py-1.5 rounded-full"
          >
            Switch Role
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {(["overview", "restaurants", "users"] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold capitalize ${activeTab === tab ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: ShoppingBag,
                label: "Total Orders",
                value: orders.length,
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: TrendingUp,
                label: "Revenue",
                value: `₹${totalRevenue}`,
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Store,
                label: "Restaurants",
                value: restaurants.length,
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: Users,
                label: "Users",
                value: SAMPLE_USERS.length,
                color: "bg-purple-50 text-purple-600",
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
        )}

        {activeTab === "restaurants" && (
          <div className="space-y-3">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
              >
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {r.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  {r.cuisineType} • {r.address}
                </p>
                <div className="flex gap-2">
                  {!r.isApproved && (
                    <button
                      type="button"
                      onClick={() => approveRestaurant(r.id)}
                      className="flex-1 bg-green-600 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={12} /> Approve
                    </button>
                  )}
                  {r.isActive && (
                    <button
                      type="button"
                      onClick={() => suspendRestaurant(r.id)}
                      className="flex-1 bg-red-50 text-red-600 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1"
                    >
                      <XCircle size={12} /> Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-3">
            {SAMPLE_USERS.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {u.name}
                  </p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                  {u.role.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
