import {
  Settings,
  Shield,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

export function SuperAdminDashboard() {
  const {
    currentUser,
    restaurants,
    orders,
    approveRestaurant,
    suspendRestaurant,
    login,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    "overview" | "restaurants" | "admins" | "settings"
  >("overview");

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.totalAmount, 0);
  const admins = SAMPLE_USERS.filter(
    (u) => u.role === "admin" || u.role === "super_admin",
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-white" />
              <p className="text-white/80 text-xs">Super Admin</p>
            </div>
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
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Orders", value: orders.length },
            { label: "Revenue", value: `₹${Math.round(totalRevenue / 1000)}k` },
            { label: "Restaurants", value: restaurants.length },
            { label: "Users", value: SAMPLE_USERS.length },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/15 rounded-xl p-2 text-center"
            >
              <p className="text-white font-bold text-base">{s.value}</p>
              <p className="text-white/70 text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white overflow-x-auto">
        {(["overview", "restaurants", "admins", "settings"] as const).map(
          (tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-xs font-semibold capitalize ${activeTab === tab ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-400"}`}
            >
              {tab}
            </button>
          ),
        )}
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
                value: `₹${totalRevenue.toLocaleString()}`,
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
                  <p className="font-semibold text-gray-900 text-sm">
                    {r.name}
                  </p>
                  <div className="flex gap-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {r.isApproved ? "✓" : "⏳"}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.isActive ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
                    >
                      {r.isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  {r.cuisineType} • ★{r.rating}
                </p>
                <div className="flex gap-2">
                  {!r.isApproved && (
                    <button
                      type="button"
                      onClick={() => approveRestaurant(r.id)}
                      className="flex-1 bg-green-600 text-white text-xs font-semibold py-1.5 rounded-xl"
                    >
                      Approve
                    </button>
                  )}
                  {r.isActive && (
                    <button
                      type="button"
                      onClick={() => suspendRestaurant(r.id)}
                      className="flex-1 bg-red-50 text-red-600 text-xs font-semibold py-1.5 rounded-xl"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "admins" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">
              Platform Administrators
            </p>
            {admins.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {u.name}
                  </p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full capitalize">
                  {u.role.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-3">
            {[
              { label: "Platform Name", value: "FoodRush", icon: "🍴" },
              { label: "Delivery Fee", value: "₹40", icon: "🛵" },
              { label: "Commission Rate", value: "15%", icon: "💰" },
              {
                label: "Support Email",
                value: "support@foodrush.in",
                icon: "📧",
              },
              { label: "Version", value: "v1.0.0", icon: "⚙️" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-xl">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="font-semibold text-gray-900">{s.value}</p>
                </div>
                <Settings size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
