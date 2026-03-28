import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { SAMPLE_USERS } from "../data/sampleData";
import type { Role } from "../types";

const ROLE_CONFIG: Record<
  Role,
  { label: string; icon: string; color: string }
> = {
  customer: {
    label: "Customer",
    icon: "🛍️",
    color: "bg-green-50 border-green-300 text-green-800",
  },
  restaurant_owner: {
    label: "Restaurant Owner",
    icon: "🍽️",
    color: "bg-orange-50 border-orange-300 text-orange-800",
  },
  delivery_partner: {
    label: "Delivery Partner",
    icon: "🏉",
    color: "bg-blue-50 border-blue-300 text-blue-800",
  },
  sponsor: {
    label: "Sponsor",
    icon: "📢",
    color: "bg-purple-50 border-purple-300 text-purple-800",
  },
  admin: {
    label: "Admin",
    icon: "⚙️",
    color: "bg-gray-50 border-gray-300 text-gray-800",
  },
  super_admin: {
    label: "Super Admin",
    icon: "👑",
    color: "bg-yellow-50 border-yellow-300 text-yellow-800",
  },
};

type Screen = "splash" | "login" | "notify" | "roles";

export function LoginPage() {
  const { login } = useApp();
  const [screen, setScreen] = useState<Screen>("splash");
  const [phone, setPhone] = useState("");
  const [showRoles, setShowRoles] = useState(false);

  const handleLogin = (role: Role) => {
    const user = SAMPLE_USERS.find((u) => u.role === role);
    if (user) login(user);
  };

  // Splash screen
  if (screen === "splash") {
    return (
      <div
        className="min-h-screen max-w-[430px] mx-auto flex flex-col"
        style={{ background: "#000" }}
      >
        {/* Top half - black with logo & text */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
          <p className="text-white font-bold text-xs tracking-[4px] mb-6 opacity-70">
            INDIA&apos;S #1 FOOD DELIVERY APP
          </p>
          {/* Zomato logo on red brush stroke */}
          <div
            className="relative mb-6 px-8 py-3 rounded-xl flex items-center justify-center"
            style={{
              background: "#E23744",
              boxShadow: "0 4px 20px rgba(226,55,68,0.5)",
            }}
          >
            <span className="text-white font-bold text-4xl tracking-tight">
              zomato
            </span>
          </div>
          {/* Food delivery bag illustration */}
          <div className="my-4 flex items-center justify-center">
            <img
              src="/assets/generated/zomato-delivery-bag.dim_300x300.png"
              alt="Delivery bag"
              className="w-44 h-44 object-contain"
            />
          </div>
        </div>

        {/* Bottom sheet - white */}
        <div className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
          <button
            type="button"
            onClick={() => setScreen("login")}
            className="w-full font-bold text-white text-base py-3.5 rounded-lg mb-3"
            style={{ background: "#E23744" }}
            data-ocid="login.primary_button"
          >
            Get Started
          </button>
          <p className="text-center text-gray-400 text-xs">
            By continuing, you agree to our{" "}
            <span className="text-gray-600 underline">Terms of Service</span>{" "}
            &amp;{" "}
            <span className="text-gray-600 underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    );
  }

  // Notifications screen
  if (screen === "notify") {
    return (
      <div className="min-h-screen max-w-[430px] mx-auto bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
                style={{ background: "#FFF0F1" }}
              >
                🔔
              </div>
              <span className="absolute -top-2 -right-2 text-3xl">🍻</span>
              <span className="absolute -bottom-2 -left-2 text-3xl">👨‍🍳</span>
              <div
                className="absolute top-0 right-8 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#E23744" }}
              >
                %
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
            Enable notifications to get updates about offers, order status and
            more
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            We&apos;ll only send you relevant notifications
          </p>
          <button
            type="button"
            onClick={() => handleLogin("customer")}
            className="w-full font-bold text-white text-base py-3.5 rounded-lg mb-3"
            style={{ background: "#E23744" }}
            data-ocid="notify.primary_button"
          >
            Enable Notifications
          </button>
          <button
            type="button"
            onClick={() => handleLogin("customer")}
            className="w-full font-bold text-base py-3.5 rounded-lg border-2"
            style={{ borderColor: "#E23744", color: "#E23744" }}
            data-ocid="notify.secondary_button"
          >
            Not now
          </button>
        </div>
      </div>
    );
  }

  // Login screen
  return (
    <div className="min-h-screen max-w-[430px] mx-auto bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div
          className="inline-block px-5 py-2 rounded-lg mb-5"
          style={{ background: "#E23744" }}
        >
          <span className="text-white font-bold text-xl">zomato</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Log in or sign up
        </h2>
        <p className="text-gray-400 text-sm">to continue with Zomato</p>
      </div>

      {/* Phone input */}
      <div className="px-5 flex-1">
        <div className="flex items-center border-2 border-gray-200 rounded-xl mb-4 overflow-hidden focus-within:border-red-400 transition-colors">
          <div className="flex items-center gap-2 px-3 py-3.5 border-r border-gray-200 bg-gray-50">
            <span className="text-lg">🇮🇳</span>
            <span className="text-sm font-semibold text-gray-700">+91</span>
            <span className="text-gray-400 text-xs">▾</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 px-3 py-3.5 text-sm text-gray-800 outline-none bg-white"
            maxLength={10}
            data-ocid="login.input"
          />
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-red-500"
            defaultChecked
          />
          <span className="text-sm text-gray-600">Remember my login</span>
        </label>

        {/* Continue button */}
        <button
          type="button"
          onClick={() => setShowRoles(true)}
          className="w-full font-bold text-white text-base py-3.5 rounded-xl mb-6"
          style={{ background: "#E23744" }}
          data-ocid="login.submit_button"
        >
          Continue
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social login */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            type="button"
            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl hover:bg-gray-50"
            onClick={() => setShowRoles(true)}
            data-ocid="login.secondary_button"
          >
            G
          </button>
          <button
            type="button"
            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50"
            onClick={() => setShowRoles(true)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="Facebook"
            >
              <title>Facebook</title>
              <rect width="24" height="24" rx="4" fill="#1877F2" />
              <path
                d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z"
                fill="white"
              />
            </svg>
          </button>
          <button
            type="button"
            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl hover:bg-gray-50"
            onClick={() => setShowRoles(true)}
          >
            ✉️
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-8 px-5">
        By continuing, you agree to our{" "}
        <span className="text-gray-600 underline">Terms of Service</span>,{" "}
        <span className="text-gray-600 underline">Privacy Policy</span> &amp;{" "}
        <span className="text-gray-600 underline">Content Policy</span>
      </p>

      {/* Role selection bottom sheet */}
      {showRoles && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setShowRoles(false)}
          />
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-[430px] w-full mx-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Select your role (Demo)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(ROLE_CONFIG) as [
                  Role,
                  (typeof ROLE_CONFIG)[Role],
                ][]
              ).map(([role, cfg]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setShowRoles(false);
                    if (role === "customer") {
                      setScreen("notify");
                    } else {
                      handleLogin(role);
                    }
                  }}
                  className={`${cfg.color} border-2 rounded-xl p-3 text-left flex items-center gap-2 hover:shadow-sm transition-all`}
                  data-ocid={`login.${role}.button`}
                >
                  <span className="text-xl">{cfg.icon}</span>
                  <span className="text-xs font-semibold">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
