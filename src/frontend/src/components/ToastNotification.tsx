import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../contexts/AppContext";

export function ToastNotification() {
  const { notifications } = useApp();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<{
    message: string;
    icon?: string;
  } | null>(null);
  const lastIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const latest = notifications[0];
    if (!latest || latest.read || latest.id === lastIdRef.current) return;
    lastIdRef.current = latest.id;
    setCurrent({ message: latest.message, icon: latest.icon });
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3500);
  }, [notifications]);

  if (!current) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[380px] px-3 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{current.icon ?? "🔔"}</span>
        <p className="text-sm flex-1 leading-snug">{current.message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
