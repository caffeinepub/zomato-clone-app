import { Check, Copy, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Progress } from "../../components/ui/progress";
import { Switch } from "../../components/ui/switch";
import { useApp } from "../../contexts/AppContext";

const TIERS = [
  { name: "Bronze", min: 0, max: 200, color: "#cd7f32" },
  { name: "Silver", min: 200, max: 500, color: "#c0c0c0" },
  { name: "Gold", min: 500, max: 1000, color: "#D4A017" },
  { name: "Platinum", min: 1000, max: 2000, color: "#b9f2ff" },
];

export function ProfilePage() {
  const {
    currentUser,
    logout,
    darkMode,
    toggleDarkMode,
    loyaltyPoints,
    redeemReferral,
  } = useApp();
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [referralMsg, setReferralMsg] = useState("");

  const referralCode =
    currentUser?.referralCode ??
    `FOOD${currentUser?.id?.toUpperCase().slice(0, 5)}`;
  const referralCount = currentUser?.referralCount ?? 0;

  const currentTier =
    TIERS.find((t) => loyaltyPoints >= t.min && loyaltyPoints < t.max) ??
    TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressPct = nextTier
    ? Math.round(
        ((loyaltyPoints - currentTier.min) / (nextTier.min - currentTier.min)) *
          100,
      )
    : 100;

  const menuItems = [
    { icon: "\uD83D\uDCE6", label: "My Orders" },
    { icon: "\uD83D\uDCCD", label: "Saved Addresses" },
    { icon: "\uD83D\uDCB3", label: "Payment Methods" },
    { icon: "\uD83C\uDF9F\uFE0F", label: "Coupons & Offers" },
    { icon: "\u2699\uFE0F", label: "Settings" },
    { icon: "\u2753", label: "Help & Support" },
    { icon: "\uD83D\uDCCB", label: "Terms & Conditions" },
  ];

  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-800";
  const border = darkMode ? "border-gray-700" : "border-gray-50";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferralSubmit = () => {
    if (!referralInput.trim()) return;
    const success = redeemReferral(referralInput.trim());
    if (success) {
      setReferralMsg("\uD83C\uDF89 Code applied! +50 loyalty points added!");
    } else {
      setReferralMsg("\u274C Invalid or already used code.");
    }
    setReferralInput("");
    setTimeout(() => setReferralMsg(""), 3000);
  };

  return (
    <div className={`flex-1 overflow-y-auto ${bg} pb-20`}>
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
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(212,160,23,0.3)",
            border: "1px solid #D4A017",
          }}
        >
          <span className="text-2xl">\uD83D\uDC51</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">
              Upgrade to Zomato Gold
            </p>
            <p className="text-white/70 text-xs">
              Get free delivery + exclusive discounts
            </p>
          </div>
          <span className="text-yellow-300 text-sm font-bold">
            \u20B91 \u2192
          </span>
        </div>
      </div>

      {/* Loyalty Points Card */}
      <div className="mx-4 mt-4">
        <div
          className="rounded-2xl p-4 text-white shadow-md"
          style={{
            background: `linear-gradient(135deg, ${currentTier.color}cc, ${currentTier.color}88)`,
            border: `1px solid ${currentTier.color}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-bold tracking-wider opacity-80">
                LOYALTY POINTS
              </p>
              <p className="text-3xl font-black text-gray-900">
                {loyaltyPoints}
              </p>
              <p className="text-xs text-gray-700 font-semibold">
                {currentTier.name} Member
              </p>
            </div>
            <div className="text-4xl">\uD83C\uDFC6</div>
          </div>
          {nextTier && (
            <>
              <div className="flex justify-between text-[10px] text-gray-700 mb-1">
                <span>{loyaltyPoints} pts</span>
                <span>
                  {nextTier.min} pts for {nextTier.name}
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </>
          )}
          <p className="text-[10px] text-gray-600 mt-2">
            100 pts = \u20B910 discount \u00B7 Earn 10 pts per \u20B9100 spent
          </p>
        </div>
      </div>

      {/* Refer & Earn Card */}
      <div className="mx-4 mt-3">
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">\uD83C\uDF81</span>
            <h3 className="text-white font-bold text-base">Refer & Earn</h3>
          </div>
          <p className="text-white/80 text-xs mb-3">
            Share your code, earn 50 loyalty points per referral
          </p>

          {/* Referral code display */}
          <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center justify-between mb-3">
            <span className="text-white font-mono font-bold text-lg tracking-widest">
              {referralCode}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="bg-white text-green-600 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Referral count */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {["r1", "r2", "r3"]
                .slice(0, Math.min(referralCount, 3))
                .map((k) => (
                  <div
                    key={k}
                    className="w-6 h-6 rounded-full bg-white/40 border-2 border-white/60 flex items-center justify-center text-[10px]"
                  >
                    \uD83D\uDC64
                  </div>
                ))}
            </div>
            <p className="text-white/90 text-xs font-semibold">
              {referralCount} friends joined
            </p>
            <div className="ml-auto text-white/60 text-xs">
              +{referralCount * 50} pts earned
            </div>
          </div>

          {/* Redeem a friend's code */}
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/80 text-xs mb-2">
              Have a friend's referral code?
            </p>
            <div className="flex gap-2">
              <input
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="Enter referral code"
                className="flex-1 bg-white/90 text-gray-800 rounded-lg px-3 py-2 text-xs placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                onClick={handleReferralSubmit}
                className="bg-white text-green-600 font-bold text-xs px-3 py-2 rounded-lg"
              >
                Apply
              </button>
            </div>
            {referralMsg && (
              <p className="text-white text-xs mt-2">{referralMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div
        className={`mx-4 mt-3 ${cardBg} rounded-2xl shadow-sm border ${border} px-4 py-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon size={18} className="text-indigo-400" />
            ) : (
              <Sun size={18} className="text-yellow-500" />
            )}
            <div>
              <p className={`text-sm font-semibold ${textPrimary}`}>
                Dark Mode
              </p>
              <p className="text-xs text-gray-400">
                {darkMode ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-indigo-500"
            data-ocid="profile.darkmode.switch"
          />
        </div>
      </div>

      {/* Menu */}
      <div
        className={`mx-4 mt-3 ${cardBg} rounded-2xl shadow-sm border ${border} overflow-hidden`}
      >
        {menuItems.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${
              idx > 0 ? `border-t ${border}` : ""
            }`}
          >
            <span className="text-xl w-8">{item.icon}</span>
            <span className={`flex-1 text-sm font-medium ${textPrimary}`}>
              {item.label}
            </span>
            <span className="text-gray-300">\u203A</span>
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
        \u00A9 {new Date().getFullYear()}. Built with love using{" "}
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
