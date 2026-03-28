import { useEffect, useRef, useState } from "react";

interface LiveMapAnimationProps {
  restaurantName?: string;
  deliveryAddress?: string;
}

export function LiveMapAnimation({
  restaurantName = "Restaurant",
  deliveryAddress = "Your Location",
}: LiveMapAnimationProps) {
  const [bikePos, setBikePos] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    animRef.current = setInterval(() => {
      setBikePos((prev) => (prev >= 1 ? 0 : prev + 0.004));
    }, 50);
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, []);

  const W = 340;
  const H = 160;
  const startX = 50;
  const startY = 110;
  const endX = 290;
  const endY = 110;
  const cp1X = 100;
  const cp1Y = 40;
  const cp2X = 240;
  const cp2Y = 40;

  function bezier(t: number) {
    const mt = 1 - t;
    const x =
      mt * mt * mt * startX +
      3 * mt * mt * t * cp1X +
      3 * mt * t * t * cp2X +
      t * t * t * endX;
    const y =
      mt * mt * mt * startY +
      3 * mt * mt * t * cp1Y +
      3 * mt * t * t * cp2Y +
      t * t * t * endY;
    return { x, y };
  }

  const bikePoint = bezier(bikePos);
  const dots = Array.from({ length: 12 }, (_, i) => bezier((i + 1) / 13));

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl overflow-hidden border border-green-100">
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-100">
        <span className="text-green-600 text-xs font-bold">
          🗺️ LIVE TRACKING
        </span>
        <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          Live
        </span>
      </div>

      <div className="relative px-2 py-1">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          aria-label="Live delivery map tracking"
          role="img"
        >
          <title>Live delivery map tracking</title>
          <defs>
            <pattern
              id="mapgrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#e5f0e8"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#mapgrid)" />

          <rect
            x="80"
            y="55"
            width="40"
            height="30"
            rx="4"
            fill="#d1fae5"
            stroke="#6ee7b7"
            strokeWidth="0.5"
          />
          <rect
            x="180"
            y="55"
            width="50"
            height="30"
            rx="4"
            fill="#dbeafe"
            stroke="#93c5fd"
            strokeWidth="0.5"
          />
          <rect
            x="130"
            y="85"
            width="35"
            height="25"
            rx="4"
            fill="#fef9c3"
            stroke="#fde68a"
            strokeWidth="0.5"
          />

          <path
            d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="4"
            strokeDasharray="8 5"
            strokeLinecap="round"
          />
          <path
            d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          {bikePos > 0.02 && (
            <path
              d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
              fill="none"
              stroke="#16a34a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${bikePos * 320} 320`}
            />
          )}

          {dots.map((d, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional
            <circle key={i} cx={d.x} cy={d.y} r="1.5" fill="#d1d5db" />
          ))}

          <g transform={`translate(${startX - 14}, ${startY - 32})`}>
            <rect width="28" height="22" rx="6" fill="#16a34a" />
            <text x="14" y="15" textAnchor="middle" fontSize="12">
              🍴
            </text>
            <polygon points="10,22 18,22 14,29" fill="#16a34a" />
          </g>

          <g transform={`translate(${endX - 14}, ${endY - 32})`}>
            <rect width="28" height="22" rx="6" fill="#E23744" />
            <text x="14" y="15" textAnchor="middle" fontSize="12">
              📍
            </text>
            <polygon points="10,22 18,22 14,29" fill="#E23744" />
          </g>

          <g transform={`translate(${bikePoint.x - 14}, ${bikePoint.y - 14})`}>
            <circle
              cx="14"
              cy="14"
              r="14"
              fill="white"
              stroke="#16a34a"
              strokeWidth="2"
            />
            <text x="14" y="19" textAnchor="middle" fontSize="14">
              🏍️
            </text>
          </g>
        </svg>
      </div>

      <div className="flex justify-between items-center px-4 pb-3">
        <div className="text-center">
          <p className="text-[9px] font-bold text-green-700 uppercase">From</p>
          <p className="text-[10px] text-gray-600 font-medium max-w-[120px] truncate">
            {restaurantName}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-green-600 font-bold">
              EN ROUTE
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-bold text-red-500 uppercase">To</p>
          <p className="text-[10px] text-gray-600 font-medium max-w-[120px] truncate">
            {deliveryAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
