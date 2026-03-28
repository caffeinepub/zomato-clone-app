import { ArrowLeft, ChevronDown, Minus, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";

interface CartPageProps {
  onBack: () => void;
  onOrderPlaced: () => void;
}

const VALID_COUPONS: Record<
  string,
  { type: "percent" | "flat"; value: number; label: string }
> = {
  SAVE20: { type: "percent", value: 20, label: "20% OFF" },
  FIRST50: { type: "flat", value: 50, label: "₹50 OFF" },
  WELCOME10: { type: "percent", value: 10, label: "10% OFF" },
  FLAT30: { type: "flat", value: 30, label: "₹30 OFF" },
  GETOFF50ON99: { type: "flat", value: 38, label: "₹38 OFF" },
};

const SUGGEST_ITEMS = [
  { id: "s1", name: "Garlic Bread", price: 79, emoji: "🥖" },
  { id: "s2", name: "Veg Soup", price: 59, emoji: "🍲" },
  { id: "s3", name: "Raita", price: 49, emoji: "🥣" },
  { id: "s4", name: "Cold Drink", price: 40, emoji: "🥤" },
];

const SCHEDULE_SLOTS = [
  "As soon as possible",
  "30 min from now",
  "1 hour from now",
  "1.5 hours from now",
  "2 hours from now",
  "2.5 hours from now",
  "3 hours from now",
  "3.5 hours from now",
  "4 hours from now",
];

export function CartPage({ onBack, onOrderPlaced }: CartPageProps) {
  const {
    cart,
    updateCartQty,
    cartTotal,
    placeOrder,
    currentUser,
    loyaltyPoints,
    redeemLoyaltyPoints,
  } = useApp();
  const [address] = useState(currentUser?.address ?? "12 MG Road, Bangalore");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<"standard" | "veg">(
    "standard",
  );
  const [deliveryType, setDeliveryType] = useState<"now" | "schedule">("now");
  const [scheduledSlot, setScheduledSlot] = useState(SCHEDULE_SLOTS[1]);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const deliveryFee = 29;
  const taxes = Math.round(cartTotal * 0.05);

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon && VALID_COUPONS[appliedCoupon]) {
    const c = VALID_COUPONS[appliedCoupon];
    couponDiscount =
      c.type === "percent" ? Math.round((cartTotal * c.value) / 100) : c.value;
  }

  // Loyalty discount
  const pointsDiscount =
    redeemPoints && loyaltyPoints >= 100
      ? Math.floor(loyaltyPoints / 100) * 10
      : 0;

  const total = Math.max(
    0,
    cartTotal + deliveryFee + taxes - couponDiscount - pointsDiscount,
  );

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
    } else {
      setCouponError(
        "Invalid coupon code. Try SAVE20, FIRST50, WELCOME10, or FLAT30",
      );
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (redeemPoints && loyaltyPoints >= 100) redeemLoyaltyPoints();
    placeOrder(
      cart[0].menuItem.restaurantId,
      cart[0].menuItem.restaurantName,
      address,
      deliveryType === "schedule" ? scheduledSlot : undefined,
    );
    setOrderPlaced(true);
    setTimeout(() => onOrderPlaced(), 2000);
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        {deliveryType === "schedule" && (
          <p className="text-green-600 text-sm font-semibold mb-1">
            🕒 Scheduled: {scheduledSlot}
          </p>
        )}
        <p className="text-gray-500 text-sm">
          Your order is being prepared. Redirecting...
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
            data-ocid="cart.back_button"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-gray-900">Cart</h2>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          data-ocid="cart.empty_state"
        >
          <div className="text-7xl mb-4">🛒</div>
          <h3 className="font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-400 text-sm">Add items to get started</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "#3D9B41" }}
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const restaurantName = cart[0]?.menuItem.restaurantName;

  return (
    <div
      className="flex-1 flex flex-col bg-gray-50"
      style={{ paddingBottom: "90px" }}
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
            data-ocid="cart.back_button"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">{restaurantName}</p>
            <button
              type="button"
              className="flex items-center gap-1"
              onClick={() => setShowAddressModal(true)}
            >
              <span className="text-xs text-gray-500">
                Delivering to: {address.slice(0, 22)}...
              </span>
              <ChevronDown size={12} className="text-gray-500" />
            </button>
          </div>
          <button type="button">
            <Share2 size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Banners */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-xs font-semibold text-yellow-800">
            ⚠️ Selected address is far from restaurant location
          </p>
        </div>
        {couponDiscount > 0 && (
          <div className="bg-blue-50 px-4 py-2.5 flex items-center gap-2">
            <span className="text-blue-600">🎉</span>
            <p className="text-xs font-semibold text-blue-700">
              You saved ₹{couponDiscount} on this order
            </p>
          </div>
        )}

        {/* Gold upsell */}
        <div className="mx-4 mt-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg,#D4A017,#FFD700)" }}
            >
              👑
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">
                Get Gold for 3 months
              </p>
              <p className="text-xs text-gray-500">
                Unlimited free delivery + more
              </p>
            </div>
            <button
              type="button"
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Cart items */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-sm font-bold text-gray-900">{restaurantName}</p>
          </div>
          {cart.map((c, idx) => (
            <div
              key={c.menuItem.id}
              className="flex items-center gap-3 px-4 py-3 border-t border-gray-50"
              data-ocid={`cart.item.${idx + 1}`}
            >
              <span
                className={
                  c.menuItem.isVeg !== false ? "veg-dot" : "nonveg-dot"
                }
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {c.menuItem.name}
                </p>
                <button
                  type="button"
                  className="text-xs text-blue-500 font-medium"
                >
                  Edit ▶
                </button>
              </div>
              <div
                className="flex items-center gap-2 rounded-lg border px-2 py-1"
                style={{ borderColor: "#3D9B41" }}
              >
                <button
                  type="button"
                  onClick={() => updateCartQty(c.menuItem.id, c.quantity - 1)}
                  data-ocid={`cart.item.${idx + 1}.toggle`}
                >
                  <Minus size={12} style={{ color: "#3D9B41" }} />
                </button>
                <span className="text-sm font-bold text-gray-900 w-4 text-center">
                  {c.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQty(c.menuItem.id, c.quantity + 1)}
                >
                  <Plus size={12} style={{ color: "#3D9B41" }} />
                </button>
              </div>
              <p className="text-sm font-bold text-gray-900 w-14 text-right">
                ₹{c.menuItem.price * c.quantity}
              </p>
            </div>
          ))}
          <div className="px-4 py-3 border-t border-gray-50">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold"
              style={{ color: "#3D9B41" }}
              data-ocid="cart.secondary_button"
            >
              + Add more items
            </button>
          </div>
          <div className="flex gap-2 px-4 pb-3">
            {["Add cooking instructions", "Request cutlery"].map((chip) => (
              <button
                key={chip}
                type="button"
                className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Complete your meal */}
        <div className="mx-4 mt-3">
          <p className="text-xs font-bold text-gray-700 mb-2">
            Complete your meal with
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {SUGGEST_ITEMS.map((s) => (
              <div
                key={s.id}
                className="flex-shrink-0 w-24 bg-white rounded-xl p-2 text-center shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-1">{s.emoji}</div>
                <p className="text-[9px] font-semibold text-gray-800 truncate">
                  {s.name}
                </p>
                <p className="text-[9px] text-gray-500">₹{s.price}</p>
                <button
                  type="button"
                  className="add-btn mt-1 w-full"
                  style={{ fontSize: 10, padding: "2px 0" }}
                >
                  ADD +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Feature 3: Promo Codes ---- */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>🎟️</span> Apply Coupon
            </p>
          </div>
          {appliedCoupon ? (
            <div className="mx-4 mb-3 bg-green-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-700">
                  ✅ {appliedCoupon} applied!
                </p>
                <p className="text-[10px] text-green-600">
                  You save ₹{couponDiscount}
                </p>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-xs text-red-500 font-semibold"
                data-ocid="cart.coupon.delete_button"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="px-4 pb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                  data-ocid="cart.coupon.input"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: "#3D9B41" }}
                  data-ocid="cart.coupon.submit_button"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p
                  className="text-[10px] text-red-500 mt-1"
                  data-ocid="cart.coupon.error_state"
                >
                  {couponError}
                </p>
              )}
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.entries(VALID_COUPONS)
                  .slice(0, 4)
                  .map(([code, info]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCouponCode(code);
                        setAppliedCoupon(code);
                        setCouponError("");
                      }}
                      className="text-[9px] bg-green-50 border border-green-200 text-green-700 font-bold px-2 py-0.5 rounded-full"
                    >
                      {code}: {info.label}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Feature 9: Loyalty Points ---- */}
        {loyaltyPoints >= 100 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900">
                  Loyalty Points
                </p>
                <p className="text-[10px] text-gray-500">
                  You have{" "}
                  <span className="font-bold text-green-600">
                    {loyaltyPoints} pts
                  </span>{" "}
                  = ₹{Math.floor(loyaltyPoints / 100) * 10} discount
                </p>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                  data-ocid="cart.loyalty.checkbox"
                />
                <span className="text-xs font-semibold text-green-700">
                  Redeem
                </span>
              </label>
            </div>
            {redeemPoints && (
              <p className="text-[10px] text-green-600 font-semibold mt-2">
                ✓ ₹{pointsDiscount} will be deducted from your total
              </p>
            )}
          </div>
        )}

        {/* Fleet selector */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-900 mb-3">Delivery by</p>
          <div className="grid grid-cols-2 gap-2">
            {(["standard", "veg"] as const).map((fleet) => (
              <button
                key={fleet}
                type="button"
                onClick={() => setSelectedFleet(fleet)}
                className={`rounded-xl p-3 border-2 text-left transition-all ${
                  selectedFleet === fleet
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                data-ocid={`cart.${fleet}_fleet.toggle`}
              >
                <span className="text-2xl">
                  {fleet === "standard" ? "🚴" : "🌿"}
                </span>
                <p className="text-xs font-bold text-gray-900 mt-1">
                  {fleet === "standard"
                    ? "Standard Fleet"
                    : "Special Veg Fleet"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {fleet === "standard" ? "All partners" : "Veg-only partners"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ---- Feature 8: Order Scheduling ---- */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-900 mb-3">
            🕒 Delivery Time
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["now", "schedule"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDeliveryType(type)}
                className={`rounded-xl py-2.5 px-3 border-2 text-sm font-semibold transition-all ${
                  deliveryType === type
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600"
                }`}
                data-ocid={`cart.delivery.${type}.toggle`}
              >
                {type === "now" ? "⚡ Deliver Now" : "🗓️ Schedule"}
              </button>
            ))}
          </div>
          {deliveryType === "schedule" && (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Select delivery slot:
              </p>
              <select
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                data-ocid="cart.schedule.select"
              >
                {SCHEDULE_SLOTS.slice(1).map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="w-full flex items-center justify-between px-4 py-3"
            data-ocid="cart.address_button"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🏠</span>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">
                  Delivery at Home
                </p>
                <p
                  className="text-xs text-gray-500 truncate"
                  style={{ maxWidth: 220 }}
                >
                  {address}
                </p>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Bill summary */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="font-bold text-sm text-gray-900 mb-3">Total Bill</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Item Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            {couponDiscount > 0 && (
              <div
                className="flex justify-between text-sm"
                style={{ color: "#3D9B41" }}
              >
                <span>Coupon ({appliedCoupon})</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div
                className="flex justify-between text-sm"
                style={{ color: "#3D9B41" }}
              >
                <span>Loyalty Points</span>
                <span>-₹{pointsDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes &amp; Charges</span>
              <span>₹{taxes}</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <div className="flex justify-between font-bold text-gray-900">
                <span>TO PAY</span>
                <span>₹{total}</span>
              </div>
              {(couponDiscount > 0 || pointsDiscount > 0) && (
                <p className="text-xs mt-1" style={{ color: "#3D9B41" }}>
                  🎉 You saved ₹{couponDiscount + pointsDiscount} on this order!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Charity */}
        <div className="mx-4 mt-3 mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">
                Serve nutritious meals to children
              </p>
              <p className="text-xs text-gray-400">Donate ₹1 with your order</p>
            </div>
            <button
              type="button"
              className="text-xs font-bold"
              style={{ color: "#3D9B41" }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3 z-20">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 font-semibold">
              PAY USING ▲
            </p>
            <p className="text-xs font-bold text-gray-900">Paytm UPI</p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm"
            style={{ background: "#3D9B41" }}
            data-ocid="cart.submit_button"
          >
            <span>₹{total} TOTAL</span>
            <span>Place Order ▶</span>
          </button>
        </div>
      </div>

      {/* Address modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setShowAddressModal(false)}
          />
          <div
            className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-[430px] w-full mx-auto"
            data-ocid="address.modal"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-base text-gray-900 mb-4">
              Select an address
            </h3>
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
              data-ocid="address.secondary_button"
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "#E23744" }}
              >
                + Add Address
              </span>
              <span className="text-gray-400">▶</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="w-full bg-white border-2 border-green-500 rounded-xl px-4 py-3 text-left"
              data-ocid="address.confirm_button"
            >
              <p className="text-[10px] font-bold text-blue-600 tracking-wider mb-0.5">
                DELIVERS TO
              </p>
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">🏠</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Home</p>
                  <p className="text-xs text-gray-500">{address}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
