import { useApp } from "../../contexts/AppContext";

export function ProfilePage() {
  const { currentUser, logout } = useApp();

  const menuItems = [
    { icon: "📦", label: "My Orders" },
    { icon: "📍", label: "Saved Addresses" },
    { icon: "💳", label: "Payment Methods" },
    { icon: "🎟️", label: "Coupons & Offers" },
    { icon: "⚙️", label: "Settings" },
    { icon: "❓", label: "Help & Support" },
    { icon: "📋", label: "Terms & Conditions" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: "linear-gradient(135deg,#1a6b55 0%,#0f4f40 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: "#E23744" }}
          >
            {currentUser?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">
              {currentUser?.name}
            </h2>
            <p className="text-white/70 text-sm">{currentUser?.phone}</p>
            <p className="text-white/60 text-xs">{currentUser?.email}</p>
          </div>
        </div>
        {/* Gold card */}
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(212,160,23,0.3)",
            border: "1px solid #D4A017",
          }}
        >
          <span className="text-2xl">👑</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">
              Upgrade to Zomato Gold
            </p>
            <p className="text-white/70 text-xs">
              Get free delivery + exclusive discounts
            </p>
          </div>
          <span className="text-yellow-300 text-sm font-bold">₹1 →</span>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${idx > 0 ? "border-t border-gray-50" : ""}`}
          >
            <span className="text-xl w-8">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">
              {item.label}
            </span>
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3">
        <button
          type="button"
          onClick={logout}
          className="w-full py-3.5 rounded-2xl font-bold text-sm border-2"
          style={{ borderColor: "#E23744", color: "#E23744" }}
          data-ocid="profile.delete_button"
        >
          Log Out
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 pb-4">
        © {new Date().getFullYear()}. Built with love using{" "}
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
  );
}
