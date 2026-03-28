import { useApp } from "../../contexts/AppContext";

const STATUS_STEPS: Array<{ key: string; label: string; icon: string }> = [
  { key: "pending", label: "Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨\u200d🍳" },
  { key: "out_for_delivery", label: "On the Way", icon: "🏍️" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function OrdersPage() {
  const { orders, currentUser } = useApp();
  const myOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const active = myOrders.find(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  );
  const past = myOrders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled",
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20 p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Orders</h2>

      {active && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Active Order</h3>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[active.status]}`}
            >
              {active.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{active.restaurantName}</p>
          <p className="text-xs text-gray-400 mb-4">
            {active.items.map((i) => i.name).join(", ")}
          </p>

          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, idx) => {
              const currentIdx = STATUS_INDEX[active.status];
              const isDone = idx <= currentIdx;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${isDone ? "bg-green-600 shadow-md scale-105" : "bg-gray-100"}`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-[9px] mt-1 text-center font-medium ${isDone ? "text-green-600" : "text-gray-400"}`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between">
            <span className="text-xs text-gray-400">
              {new Date(active.createdAt).toLocaleTimeString()}
            </span>
            <span className="text-sm font-bold text-gray-900">
              ₹{active.totalAmount}
            </span>
          </div>
        </div>
      )}

      {past.length > 0 && (
        <>
          <h3 className="font-bold text-gray-900 mb-3">Past Orders</h3>
          <div className="space-y-3">
            {past.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {order.restaurantName}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {order.items.map((i) => i.name).join(", ")}
                </p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full border border-green-600 text-green-600 text-xs font-semibold py-1.5 rounded-xl hover:bg-green-50"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {myOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-400 text-sm">
            Your order history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
