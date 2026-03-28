import { Star } from "lucide-react";
import { useState } from "react";
import { LiveMapAnimation } from "../../components/LiveMapAnimation";
import { useApp } from "../../contexts/AppContext";

const STATUS_STEPS: Array<{ key: string; label: string; icon: string }> = [
  { key: "pending", label: "Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
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
  const { orders, currentUser, reviews, addReview, darkMode } = useApp();
  const myOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const active = myOrders.find(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  );
  const past = myOrders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled",
  );

  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<string[]>([]);

  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-400";

  const submitReview = (order: (typeof past)[0]) => {
    if (!currentUser) return;
    addReview({
      orderId: order.id,
      restaurantId: order.restaurantId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating: starRating,
      comment: reviewText || "Great experience!",
    });
    setSubmittedReviews((prev) => [...prev, order.id]);
    setReviewOrderId(null);
    setStarRating(5);
    setReviewText("");
  };

  const hasReviewedOrder = (orderId: string) =>
    submittedReviews.includes(orderId) ||
    reviews.some((r) => r.orderId === orderId);

  return (
    <div className={`flex-1 overflow-y-auto pb-20 p-4 ${bg}`}>
      <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>My Orders</h2>

      {active && (
        <div
          className={`${cardBg} rounded-3xl p-4 shadow-sm border border-gray-50 mb-5`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold ${textPrimary}`}>Active Order</h3>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[active.status]}`}
            >
              {active.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className={`text-sm ${textMuted} mb-1`}>{active.restaurantName}</p>
          <p className={`text-xs ${textMuted} mb-4`}>
            {active.items.map((i) => i.name).join(", ")}
          </p>

          {/* Scheduled time badge */}
          {active.scheduledTime && (
            <div className="mb-3 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
              <p className="text-xs text-purple-700 font-semibold">
                🕒 Scheduled: {active.scheduledTime}
              </p>
            </div>
          )}

          {/* Live map - show when out for delivery */}
          {active.status === "out_for_delivery" && (
            <div className="mb-4">
              <LiveMapAnimation
                restaurantName={active.restaurantName}
                deliveryAddress={active.deliveryAddress}
              />
            </div>
          )}

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
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
                      isDone
                        ? "bg-green-600 shadow-md scale-105"
                        : "bg-gray-100"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-[9px] mt-1 text-center font-medium ${isDone ? "text-green-600" : textMuted}`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between">
            <span className={`text-xs ${textMuted}`}>
              {new Date(active.createdAt).toLocaleTimeString()}
            </span>
            <span className={`text-sm font-bold ${textPrimary}`}>
              ₹{active.totalAmount}
            </span>
          </div>
        </div>
      )}

      {past.length > 0 && (
        <>
          <h3 className={`font-bold ${textPrimary} mb-3`}>Past Orders</h3>
          <div className="space-y-3">
            {past.map((order) => (
              <div
                key={order.id}
                className={`${cardBg} rounded-2xl p-4 shadow-sm border border-gray-50`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold ${textPrimary} text-sm`}>
                    {order.restaurantName}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className={`text-xs ${textMuted}`}>
                  {order.items.map((i) => i.name).join(", ")}
                </p>
                {order.scheduledTime && (
                  <p className="text-[10px] text-purple-600 font-semibold mt-1">
                    🕒 {order.scheduledTime}
                  </p>
                )}
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${textMuted}`}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-sm font-bold ${textPrimary}`}>
                    ₹{order.totalAmount}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full border border-green-600 text-green-600 text-xs font-semibold py-1.5 rounded-xl hover:bg-green-50"
                >
                  Reorder
                </button>

                {/* Feature 6: Review card for delivered orders */}
                {order.status === "delivered" &&
                  !hasReviewedOrder(order.id) && (
                    <div className="mt-3 bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
                      {reviewOrderId === order.id ? (
                        <div>
                          <p className="text-xs font-bold text-gray-800 mb-2">
                            Rate your experience
                          </p>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setStarRating(s)}
                              >
                                <Star
                                  size={22}
                                  className={
                                    s <= starRating
                                      ? "fill-yellow-400 stroke-yellow-400"
                                      : "stroke-gray-300"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Tell us about your experience..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none resize-none"
                            rows={2}
                            data-ocid="orders.review.textarea"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => submitReview(order)}
                              className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                              style={{ background: "#3D9B41" }}
                              data-ocid="orders.review.submit_button"
                            >
                              Submit Review
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewOrderId(null)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200"
                              data-ocid="orders.review.cancel_button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReviewOrderId(order.id)}
                          className="w-full flex items-center gap-2"
                          data-ocid="orders.review.open_modal_button"
                        >
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className="fill-yellow-400 stroke-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">
                            Rate your experience
                          </span>
                          <span className="ml-auto text-xs text-green-600 font-bold">
                            ▶
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                {order.status === "delivered" && hasReviewedOrder(order.id) && (
                  <div className="mt-2 bg-green-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-green-700 font-semibold">
                      ✅ Review submitted. Thank you!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {myOrders.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="orders.empty_state"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className={`font-bold ${textPrimary} mb-2`}>No orders yet</h3>
          <p className={`${textMuted} text-sm`}>
            Your order history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
