import { CheckCircle, MapPin, Package, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

export function DeliveryDashboard() {
  const { currentUser, orders, updateOrderStatus, login } = useApp();
  const [activeTab, setActiveTab] = useState<
    "available" | "active" | "earnings"
  >("available");

  const availableOrders = orders.filter(
    (o) => o.status === "preparing" && !o.deliveryPartnerId,
  );
  const activeDelivery = orders.find(
    (o) =>
      o.deliveryPartnerId === currentUser?.id &&
      o.status === "out_for_delivery",
  );
  const deliveredCount = orders.filter(
    (o) => o.deliveryPartnerId === currentUser?.id && o.status === "delivered",
  ).length;
  const earnings = deliveredCount * 40;

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-xs">Delivery Partner</p>
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
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Delivered", value: deliveredCount, icon: CheckCircle },
            { label: "Earnings", value: `₹${earnings}`, icon: TrendingUp },
            { label: "Rating", value: "4.8 ★", icon: Package },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white/15 rounded-2xl p-3 text-center"
              >
                <Icon size={18} className="text-white/70 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-white/70 text-[10px]">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {(["available", "active", "earnings"] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold capitalize ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "available" && (
          <div className="space-y-3">
            {availableOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🛵</div>
                <p className="text-gray-400 text-sm">
                  No deliveries available right now
                </p>
              </div>
            ) : (
              availableOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {order.restaurantName}
                    </p>
                    <span className="text-green-600 font-bold text-sm">
                      ₹40
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin
                      size={14}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-gray-500">
                      {order.deliveryAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOrderStatus(order.id, "out_for_delivery")
                    }
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Accept Delivery
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "active" && (
          <div>
            {!activeDelivery ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-400 text-sm">No active delivery</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
                <p className="font-bold text-gray-900 mb-1">Active Delivery</p>
                <p className="text-sm text-gray-600 mb-1">
                  {activeDelivery.restaurantName}
                </p>
                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={14} className="text-red-400 mt-0.5" />
                  <p className="text-xs text-gray-500">
                    {activeDelivery.deliveryAddress}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-2xl h-32 flex items-center justify-center mb-4">
                  <p className="text-blue-400 text-sm">🗺️ Map View</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateOrderStatus(activeDelivery.id, "delivered")
                  }
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl text-sm"
                >
                  Mark as Delivered ✓
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
              <p className="text-white/80 text-sm">Total Earnings</p>
              <p className="text-4xl font-bold mt-1">₹{earnings}</p>
              <p className="text-white/70 text-xs mt-1">
                {deliveredCount} deliveries completed
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <p className="font-semibold text-gray-900 mb-3">
                Earnings Breakdown
              </p>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Per delivery</span>
                <span className="text-sm font-bold text-green-600">₹40</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Total delivered</span>
                <span className="text-sm font-bold">{deliveredCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
