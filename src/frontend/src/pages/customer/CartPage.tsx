import { ArrowLeft, ChevronDown, Minus, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../contexts/AppContext";

interface CartPageProps {
  onBack: () => void;
  onOrderPlaced: () => void;
}

const COUPON_CODE = "GETOFF50ON99";
const COUPON_DISCOUNT = 38;

const SUGGEST_ITEMS = [
  { id: "s1", name: "Garlic Bread", price: 79, emoji: "🫓" },
  { id: "s2", name: "Veg Soup", price: 59, emoji: "🍲" },
  { id: "s3", name: "Raita", price: 49, emoji: "🥣" },
  { id: "s4", name: "Cold Drink", price: 40, emoji: "🥤" },
];

export function CartPage({ onBack, onOrderPlaced }: CartPageProps) {
  const { cart, updateCartQty, cartTotal, placeOrder, currentUser } = useApp();
  const [address] = useState(currentUser?.address ?? "12 MG Road, Bangalore");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponModal, setCouponModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<"standard" | "veg">(
    "standard",
  );

  const deliveryFee = 29;
  const taxes = Math.round(cartTotal * 0.05);
  const discount = couponApplied ? COUPON_DISCOUNT : 0;
  const total = cartTotal + deliveryFee + taxes - discount;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    placeOrder(
      cart[0].menuItem.restaurantId,
      cart[0].menuItem.restaurantName,
      address,
    );
    setOrderPlaced(true);
    setTimeout(() => onOrderPlaced(), 2000);
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
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
        <div className="bg-blue-50 px-4 py-2.5 flex items-center gap-2">
          <span className="text-blue-600">🎉</span>
          <p className="text-xs font-semibold text-blue-700">
            You saved ₹{COUPON_DISCOUNT} on this order
          </p>
        </div>

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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700"
              >
                ADD
              </button>
              <span className="text-sm font-bold text-gray-900">₹1</span>
            </div>
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

        {/* Coupon */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setCouponModal(true)}
            className="w-full flex items-center justify-between px-4 py-3"
            data-ocid="cart.coupon_button"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎟️</span>
              <span className="text-sm font-semibold text-gray-900">
                {couponApplied
                  ? `Coupon '${COUPON_CODE}' applied!`
                  : "Apply Coupon"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {couponApplied && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#3D9B41" }}
                >
                  -₹{COUPON_DISCOUNT}
                </span>
              )}
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </button>
          {!couponApplied && (
            <div className="px-4 pb-3">
              <div className="bg-green-50 rounded-xl px-3 py-2">
                <p
                  className="text-xs font-semibold"
                  style={{ color: "#3D9B41" }}
                >
                  🔓 Save extra by applying a coupon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fleet selector */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-900 mb-3">Delivery by</p>
          <div className="grid grid-cols-2 gap-2">
            {(["standard", "veg"] as const).map((fleet) => (
              <button
                key={fleet}
                type="button"
                onClick={() => setSelectedFleet(fleet)}
                className={`rounded-xl p-3 border-2 text-left transition-all ${selectedFleet === fleet ? "border-green-500 bg-green-50" : "border-gray-200"}`}
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
            {couponApplied && (
              <div
                className="flex justify-between text-sm"
                style={{ color: "#3D9B41" }}
              >
                <span>Coupon ({COUPON_CODE})</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes &amp; Charges</span>
              <span>₹{taxes}</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <div className="flex justify-between font-bold text-gray-900">
                <span>TO PAY</span>
                <div className="text-right">
                  <span className="line-through text-gray-400 text-xs mr-1">
                    ₹{cartTotal + deliveryFee + taxes}
                  </span>
                  <span>₹{total}</span>
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: "#3D9B41" }}>
                🎉 You saved ₹{COUPON_DISCOUNT} on this order!
              </p>
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
            <p className="text-xs font-bold text-gray-400 mb-2 tracking-wider">
              SAVED ADDRESSES
            </p>
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
                  <p className="text-xs text-gray-400 mt-0.5">1.2 km away</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Coupon modal */}
      {couponModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setCouponModal(false)}
          />
          <div
            className="rounded-t-3xl px-5 pt-6 pb-8 max-w-[430px] w-full mx-auto"
            style={{
              background: "linear-gradient(180deg,#E3F0FF 0%,#fff 60%)",
            }}
            data-ocid="coupon.modal"
          >
            <div className="w-10 h-1 bg-blue-200 rounded-full mx-auto mb-5" />
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black"
                style={{ background: "#2196F3", color: "white" }}
              >
                %
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-blue-500 tracking-widest mb-2">
              ✦ EXCLUSIVELY FOR YOU ✦
            </p>
            <h3 className="text-center text-xl font-black text-gray-900 mb-1">
              Save <span className="text-blue-600">₹{COUPON_DISCOUNT}</span> on
              this order
            </h3>
            <p className="text-center text-sm text-gray-600 mb-1">
              with coupon &apos;<strong>{COUPON_CODE}</strong>&apos;
            </p>
            <p className="text-center text-xs text-gray-400 mb-5">
              Tap on &apos;APPLY&apos; to avail this
            </p>
            <button
              type="button"
              onClick={() => {
                setCouponApplied(true);
                setCouponModal(false);
              }}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm tracking-wider"
              style={{ background: "#3D9B41" }}
              data-ocid="coupon.confirm_button"
            >
              APPLY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
