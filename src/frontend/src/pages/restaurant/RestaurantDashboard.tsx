import {
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Edit2,
  MessageSquare,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { useApp } from "../../contexts/AppContext";
import { SAMPLE_USERS } from "../../data/sampleData";

type Tab =
  | "dashboard"
  | "orders"
  | "menu"
  | "analytics"
  | "reviews"
  | "settings"
  | "promotions";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-green-100 text-green-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-500",
  rejected: "bg-red-100 text-red-600",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function RestaurantDashboard() {
  const {
    currentUser,
    menuItems,
    orders,
    reviews,
    login,
    updateOrderStatus,
    updateMenuItem,
    replyToReview,
    restaurantOffers,
    addOffer,
    toggleOffer,
    restaurantOnline,
    toggleRestaurantOnline,
    addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("All");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [prepTimeMap, setPrepTimeMap] = useState<Record<string, number>>({});

  // New offer form state
  const [newOffer, setNewOffer] = useState({
    title: "",
    type: "flat" as "percent" | "flat" | "free_delivery",
    value: 0,
    minOrder: 0,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
  });

  // Settings form state
  const [settings, setSettings] = useState({
    name: "Royal Cafe & Restaurant",
    cuisine: "Pizza, Sandwiches, Burgers",
    address: "Shop 4, Ground Floor, Koramangala",
    minOrder: "99",
    deliveryTime: "30-35 min",
    hours: DAYS.map((d) => ({
      day: d,
      open: true,
      from: "09:00",
      to: "22:00",
    })),
  });

  const myRestaurantId = "r1";
  const myItems = menuItems.filter((i) => i.restaurantId === myRestaurantId);
  const myOrders = orders.filter((o) => o.restaurantId === myRestaurantId);
  const myReviews = reviews.filter((r) => r.restaurantId === myRestaurantId);
  const revenue = myOrders
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + o.totalAmount, 0);

  const avgRating =
    myReviews.length > 0
      ? (
          myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
        ).toFixed(1)
      : "4.6";

  const categories = [
    "All",
    ...Array.from(new Set(myItems.map((i) => i.category))),
  ];
  const filteredItems =
    menuCategoryFilter === "All"
      ? myItems
      : myItems.filter((i) => i.category === menuCategoryFilter);

  const STATUS_NEXT: Record<string, string> = {
    confirmed: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
  };
  const STATUS_LABELS: Record<string, string> = {
    confirmed: "Start Preparing",
    preparing: "Mark Ready",
    ready: "Hand to Delivery",
  };

  // Analytics data (simulated)
  const weekRevenue = [1240, 980, 1450, 2100, 1800, 2450, 1920];
  const maxRev = Math.max(...weekRevenue);
  const topItems = [
    { name: "Veg Cheese Pizza", orders: 34, revenue: 3740 },
    { name: "Maharaja Burger", orders: 28, revenue: 2800 },
    { name: "Red Sauce Pasta", orders: 22, revenue: 1100 },
  ];

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    addNotification("\u2705 Restaurant settings saved successfully!", "\u2705");
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleAddOffer = () => {
    if (!newOffer.title) return;
    addOffer({ ...newOffer, restaurantId: myRestaurantId, isActive: true });
    setNewOffer({
      title: "",
      type: "flat",
      value: 0,
      minOrder: 0,
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });
    setShowOfferForm(false);
    addNotification("\uD83C\uDF89 New promotion added!", "\uD83C\uDF89");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Home", icon: <ShoppingBag size={13} /> },
    { id: "orders", label: "Orders", icon: <UtensilsCrossed size={13} /> },
    { id: "menu", label: "Menu", icon: <Tag size={13} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={13} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={13} /> },
    { id: "settings", label: "Settings", icon: <Settings size={13} /> },
    { id: "promotions", label: "Promos", icon: <DollarSign size={13} /> },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-xs">Restaurant Owner</p>
            <h2 className="text-white font-bold text-lg">
              {currentUser?.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRestaurantOnline}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                restaurantOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {restaurantOnline ? "\uD83D\uDFE2 Online" : "\u26AB Offline"}
            </button>
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
      </div>

      {/* Tabs - scrollable */}
      <div className="flex border-b border-gray-100 bg-white overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-2.5 text-[11px] font-semibold capitalize transition-colors flex items-center gap-1 ${
              activeTab === tab.id
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-400"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* ===== DASHBOARD TAB ===== */}
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
                  value: `\u20B9${revenue}`,
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
                  value: avgRating,
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
              {myOrders.slice(0, 4).map((o) => (
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
                      {o.customerName ?? o.deliveryAddress.split(",")[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      \u20B9{o.totalAmount}
                    </p>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-orange-50 rounded-2xl p-4">
              <p className="text-sm font-bold text-orange-700 mb-1">
                Today's Summary
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-black text-orange-600">
                    {
                      myOrders.filter(
                        (o) =>
                          o.status !== "rejected" && o.status !== "cancelled",
                      ).length
                    }
                  </p>
                  <p className="text-[10px] text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-lg font-black text-green-600">
                    {myOrders.filter((o) => o.status === "delivered").length}
                  </p>
                  <p className="text-[10px] text-gray-500">Delivered</p>
                </div>
                <div>
                  <p className="text-lg font-black text-red-500">
                    {
                      myOrders.filter(
                        (o) =>
                          o.status === "rejected" || o.status === "cancelled",
                      ).length
                    }
                  </p>
                  <p className="text-[10px] text-gray-500">Cancelled</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {myOrders.map((order) => {
              const expanded = expandedOrder === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold text-sm text-gray-900">
                        Order #{order.id.slice(-4)}
                      </p>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    {order.customerName && (
                      <p className="text-xs text-gray-500 mb-1">
                        \uD83D\uDC64 {order.customerName} \u00B7 \uD83D\uDCDE{" "}
                        {order.customerPhone}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mb-2">
                      {order.items
                        .map((i) => `${i.name} x${i.quantity}`)
                        .join(", ")}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        \u20B9{order.totalAmount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(expanded ? null : order.id)
                        }
                        className="text-gray-400 flex items-center gap-0.5 text-xs"
                      >
                        Details{" "}
                        {expanded ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>
                    </div>

                    {/* Accept / Reject for pending */}
                    {order.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(order.id, "confirmed");
                            addNotification(
                              `\u2705 Order #${order.id.slice(-4)} confirmed!`,
                              "\u2705",
                            );
                          }}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-xl text-xs font-bold"
                        >
                          <CheckCircle size={13} /> Accept
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(order.id, "rejected")
                          }
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}

                    {/* Status progression for confirmed/preparing/ready */}
                    {STATUS_NEXT[order.status] && (
                      <div className="mt-3 flex gap-2 items-center">
                        <select
                          className="text-xs border border-gray-100 bg-gray-50 rounded-lg px-2 py-1.5 outline-none"
                          value={prepTimeMap[order.id] ?? 15}
                          onChange={(e) =>
                            setPrepTimeMap((p) => ({
                              ...p,
                              [order.id]: Number(e.target.value),
                            }))
                          }
                        >
                          {[10, 15, 20, 30].map((t) => (
                            <option key={t} value={t}>
                              {t} min
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              STATUS_NEXT[order.status] as never,
                            )
                          }
                          className="flex-1 text-xs bg-orange-500 text-white px-3 py-2 rounded-xl font-bold"
                        >
                          {STATUS_LABELS[order.status]}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded details */}
                  {expanded && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Order Items
                      </p>
                      {order.items.map((item) => (
                        <div
                          key={item.menuItemId}
                          className="flex justify-between text-xs py-1"
                        >
                          <span className="text-gray-700">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium text-gray-900">
                            \u20B9{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs font-bold">
                        <span>Total</span>
                        <span>\u20B9{order.totalAmount}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">
                        \uD83D\uDCCD {order.deliveryAddress}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== MENU TAB ===== */}
        {activeTab === "menu" && (
          <div>
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMenuCategoryFilter(cat)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    menuCategoryFilter === cat
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMenuForm(!showMenuForm)}
              className="w-full mb-4 border-2 border-dashed border-orange-300 text-orange-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50"
            >
              <Plus size={18} /> Add New Item
            </button>

            {showMenuForm && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <p className="font-semibold text-gray-900 mb-3">
                  Add Menu Item
                </p>
                {["Item Name", "Category", "Price (\u20B9)", "Description"].map(
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
                  onClick={() => setShowMenuForm(false)}
                  className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm mt-1"
                >
                  Save Item
                </button>
              </div>
            )}

            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50"
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${item.imageColor} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
                    >
                      \uD83C\uDF7D\uFE0F
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span
                          className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${
                            item.isVeg ? "border-green-600" : "border-red-500"
                          }`}
                        >
                          <span
                            className={`block w-1.5 h-1.5 rounded-full m-0.5 ${
                              item.isVeg ? "bg-green-600" : "bg-red-500"
                            }`}
                          />
                        </span>
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {item.name}
                        </p>
                        {item.isBestSeller && (
                          <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                            \uD83D\uDD25 BEST
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {item.category} \u00B7 \u20B9{item.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateMenuItem(item.id, {
                              isBestSeller: !item.isBestSeller,
                            })
                          }
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            item.isBestSeller
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                          title="Toggle Best Seller"
                        >
                          \uD83D\uDD25
                        </button>
                        <button type="button" className="text-blue-400">
                          <Edit2 size={13} />
                        </button>
                        <button type="button" className="text-red-400">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={(v) =>
                          updateMenuItem(item.id, { isAvailable: v })
                        }
                        className="data-[state=checked]:bg-green-500 scale-75"
                      />
                      <span
                        className={`text-[9px] font-medium ${
                          item.isAvailable ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Off"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Total Customers",
                  value: "42",
                  sub: "this month",
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Avg Order Value",
                  value: "\u20B9285",
                  sub: "per order",
                  color: "text-green-600 bg-green-50",
                },
                {
                  label: "Repeat Rate",
                  value: "68%",
                  sub: "customers returning",
                  color: "text-purple-600 bg-purple-50",
                },
                {
                  label: "Cancel Rate",
                  value: "4%",
                  sub: "of all orders",
                  color: "text-red-500 bg-red-50",
                },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs font-semibold mt-0.5">{s.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue bar chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Revenue Last 7 Days
              </h3>
              <div className="flex items-end gap-2 h-24">
                {weekRevenue.map((rev, i) => (
                  <div
                    key={DAYS[i]}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-orange-400 rounded-t-md transition-all"
                      style={{ height: `${(rev / maxRev) * 80}px` }}
                    />
                    <span className="text-[9px] text-gray-400">{DAYS[i]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-400">
                  Total: \u20B9
                  {weekRevenue.reduce((a, b) => a + b, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-green-600 font-semibold">
                  \u2191 12% vs last week
                </span>
              </div>
            </div>

            {/* Top items */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Top Selling Items
              </h3>
              {topItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? "bg-yellow-100 text-yellow-600"
                        : idx === 1
                          ? "bg-gray-100 text-gray-600"
                          : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {item.orders} orders
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    \u20B9{item.revenue}
                  </span>
                </div>
              ))}
            </div>

            {/* Peak hours */}
            <div className="bg-orange-50 rounded-2xl p-4">
              <h3 className="font-bold text-orange-700 mb-2 text-sm">
                \uD83D\uDD25 Peak Hours
              </h3>
              <div className="flex gap-2">
                {["12pm\u20132pm", "7pm\u20139pm"].map((h) => (
                  <span
                    key={h}
                    className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <p className="text-4xl font-black text-gray-900">
                    {avgRating}
                  </p>
                  <p className="text-yellow-500 text-sm">
                    {"\u2605".repeat(Math.round(Number(avgRating)))}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {myReviews.length} reviews
                  </p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = myReviews.filter(
                      (r) => r.rating === star,
                    ).length;
                    const pct = myReviews.length
                      ? (count / myReviews.length) * 100
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-400 w-3">
                          {star}
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 w-4">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review list */}
            {myReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
              >
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {review.customerName}
                  </p>
                  <span className="text-yellow-500 text-xs">
                    {"\u2605".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{review.comment}</p>
                <p className="text-[10px] text-gray-400 mb-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>

                {review.reply ? (
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-orange-600 mb-0.5">
                      Your Reply
                    </p>
                    <p className="text-xs text-gray-700">
                      {review.reply.reply}
                    </p>
                  </div>
                ) : (
                  <>
                    {replyingTo === review.id ? (
                      <div className="mt-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full text-xs border border-gray-100 bg-gray-50 rounded-xl p-2.5 outline-none resize-none h-16"
                        />
                        <div className="flex gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              replyToReview(review.id, replyText);
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="flex-1 bg-orange-500 text-white text-xs py-2 rounded-xl font-bold"
                          >
                            Post Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="px-3 bg-gray-100 text-gray-500 text-xs py-2 rounded-xl"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setReplyingTo(review.id)}
                        className="text-xs text-orange-600 font-medium flex items-center gap-1"
                      >
                        <MessageSquare size={12} /> Reply
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            {/* Online/Offline */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Restaurant Status</p>
                  <p className="text-xs text-gray-400">
                    {restaurantOnline
                      ? "Accepting orders"
                      : "Not accepting orders"}
                  </p>
                </div>
                <Switch
                  checked={restaurantOnline}
                  onCheckedChange={toggleRestaurantOnline}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            {/* Edit profile */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">
                Restaurant Profile
              </h3>
              {(
                [
                  { label: "Restaurant Name", key: "name" },
                  { label: "Cuisine Types", key: "cuisine" },
                  { label: "Address", key: "address" },
                  { label: "Min Order (\u20B9)", key: "minOrder" },
                  { label: "Delivery Time", key: "deliveryTime" },
                ] as { label: string; key: keyof typeof settings }[]
              ).map((field) => (
                <div key={field.key} className="mb-3">
                  <span className="text-xs text-gray-500 font-medium block mb-1">
                    {field.label}
                  </span>
                  <input
                    value={settings[field.key] as string}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full text-sm border border-gray-100 bg-gray-50 rounded-xl p-2.5 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Opening hours */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">Opening Hours</h3>
              {settings.hours.map((h, idx) => (
                <div key={h.day} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 w-8">{h.day}</span>
                  <Switch
                    checked={h.open}
                    onCheckedChange={(v) => {
                      const hours = [...settings.hours];
                      hours[idx] = { ...hours[idx], open: v };
                      setSettings((p) => ({ ...p, hours }));
                    }}
                    className="data-[state=checked]:bg-green-500 scale-75"
                  />
                  {h.open ? (
                    <>
                      <input
                        type="time"
                        value={h.from}
                        onChange={(e) => {
                          const hours = [...settings.hours];
                          hours[idx] = { ...hours[idx], from: e.target.value };
                          setSettings((p) => ({ ...p, hours }));
                        }}
                        className="text-xs border border-gray-100 bg-gray-50 rounded-lg px-2 py-1 outline-none flex-1"
                      />
                      <span className="text-xs text-gray-400">\u2013</span>
                      <input
                        type="time"
                        value={h.to}
                        onChange={(e) => {
                          const hours = [...settings.hours];
                          hours[idx] = { ...hours[idx], to: e.target.value };
                          setSettings((p) => ({ ...p, hours }));
                        }}
                        className="text-xs border border-gray-100 bg-gray-50 rounded-lg px-2 py-1 outline-none flex-1"
                      />
                    </>
                  ) : (
                    <span className="text-xs text-red-400 font-medium">
                      Closed
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-colors ${
                settingsSaved
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {settingsSaved ? "\u2705 Saved!" : "Save Changes"}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-red-300 text-red-500"
            >
              Temporarily Close Restaurant
            </button>
          </div>
        )}

        {/* ===== PROMOTIONS TAB ===== */}
        {activeTab === "promotions" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="w-full border-2 border-dashed border-orange-300 text-orange-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50"
            >
              <Plus size={18} /> Create Promotion
            </button>

            {showOfferForm && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-900 mb-3">
                  New Promotion
                </p>
                <input
                  placeholder="Title (e.g. Weekend Special)"
                  value={newOffer.title}
                  onChange={(e) =>
                    setNewOffer((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
                />
                <select
                  value={newOffer.type}
                  onChange={(e) =>
                    setNewOffer((p) => ({
                      ...p,
                      type: e.target.value as
                        | "percent"
                        | "flat"
                        | "free_delivery",
                    }))
                  }
                  className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
                >
                  <option value="flat">Flat \u20B9 Off</option>
                  <option value="percent">% Off</option>
                  <option value="free_delivery">Free Delivery</option>
                </select>
                {newOffer.type !== "free_delivery" && (
                  <input
                    type="number"
                    placeholder={
                      newOffer.type === "percent"
                        ? "Discount %"
                        : "Discount Amount (\u20B9)"
                    }
                    value={newOffer.value || ""}
                    onChange={(e) =>
                      setNewOffer((p) => ({
                        ...p,
                        value: Number(e.target.value),
                      }))
                    }
                    className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
                  />
                )}
                <input
                  type="number"
                  placeholder="Min Order Amount (\u20B9)"
                  value={newOffer.minOrder || ""}
                  onChange={(e) =>
                    setNewOffer((p) => ({
                      ...p,
                      minOrder: Number(e.target.value),
                    }))
                  }
                  className="w-full mb-2 text-sm border border-gray-100 bg-gray-50 rounded-xl p-3 outline-none"
                />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">
                      Start Date
                    </span>
                    <input
                      type="date"
                      value={newOffer.startDate}
                      onChange={(e) =>
                        setNewOffer((p) => ({
                          ...p,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full text-xs border border-gray-100 bg-gray-50 rounded-xl p-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">
                      End Date
                    </span>
                    <input
                      type="date"
                      value={newOffer.endDate}
                      onChange={(e) =>
                        setNewOffer((p) => ({ ...p, endDate: e.target.value }))
                      }
                      className="w-full text-xs border border-gray-100 bg-gray-50 rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Add Promotion
                </button>
              </div>
            )}

            {restaurantOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {offer.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {offer.type === "percent"
                        ? `${offer.value}% off`
                        : offer.type === "flat"
                          ? `\u20B9${offer.value} off`
                          : "Free delivery"}
                      {offer.minOrder > 0
                        ? ` above \u20B9${offer.minOrder}`
                        : ""}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">
                      {offer.startDate} \u2013 {offer.endDate}
                    </p>
                  </div>
                  <Switch
                    checked={offer.isActive}
                    onCheckedChange={() => toggleOffer(offer.id)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    offer.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
