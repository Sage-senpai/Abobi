"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface PolicyAlert {
  flag: string;
  country: string;
  headline: string;
  type: "update" | "deadline" | "new" | "warning";
}

const ALERTS: PolicyAlert[] = [
  { flag: "🇺🇸", country: "US", headline: "H-1B FY2026 lottery registration: March 1–18", type: "deadline" },
  { flag: "🇨🇦", country: "Canada", headline: "Express Entry draw: 3,700 ITAs issued, CRS cutoff 524", type: "update" },
  { flag: "🇬🇧", country: "UK", headline: "Skilled Worker salary threshold raised to £38,700 in 2024", type: "update" },
  { flag: "🇩🇪", country: "Germany", headline: "New Chancenkarte (opportunity card) launched — no job offer needed", type: "new" },
  { flag: "🇦🇺", country: "Australia", headline: "Migration Strategy 2024–25: 185,000 places allocated", type: "update" },
  { flag: "🇦🇪", country: "UAE", headline: "Golden Visa income threshold lowered — easier qualification", type: "new" },
  { flag: "🇯🇵", country: "Japan", headline: "SSW program expanded to 14 industries from April 2024", type: "new" },
  { flag: "🇳🇱", country: "Netherlands", headline: "Highly Skilled Migrant salary threshold updated for 2025", type: "update" },
  { flag: "🇨🇦", country: "Canada", headline: "International Students: PGWP eligibility rules updated", type: "warning" },
  { flag: "🇬🇧", country: "UK", headline: "Graduate Route visa under review — monitor for changes", type: "warning" },
];

const TYPE_STYLES = {
  update: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-400", label: "Update" },
  deadline: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", label: "Deadline" },
  new: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-400", label: "New" },
  warning: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-400", label: "Alert" },
};

export function PolicyAlertsStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animFrame: number;
    let lastTime = 0;

    const scroll = (time: number) => {
      if (!isPaused) {
        const delta = time - lastTime;
        if (delta > 16) { // ~60fps
          el.scrollLeft += 0.5;
          // Reset when past halfway (we duplicate the list)
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
          lastTime = time;
        }
      }
      animFrame = requestAnimationFrame(scroll);
    };

    animFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused]);

  // Duplicate for seamless loop
  const items = [...ALERTS, ...ALERTS];

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
          </span>
          <p className="text-[#0F172A] font-bold text-sm">Policy Alerts</p>
        </div>
        <p className="text-[#94A3B8] text-xs">Live immigration updates</p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {items.map((alert, i) => {
          const style = TYPE_STYLES[alert.type];
          return (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className={`flex-shrink-0 flex items-start gap-2.5 p-3 rounded-xl border cursor-default ${style.bg} ${style.border}`}
              style={{ minWidth: "220px", maxWidth: "260px" }}
            >
              <span className="text-lg flex-shrink-0">{alert.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${style.text} bg-white/60 border ${style.border}`}>
                    {style.label}
                  </span>
                  <span className="text-[#94A3B8] text-[10px] font-medium">{alert.country}</span>
                </div>
                <p className={`text-xs font-medium leading-snug ${style.text}`}>{alert.headline}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
