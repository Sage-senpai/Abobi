"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useHistory } from "@/hooks/useHistory";
import { format, subDays, isSameDay } from "date-fns";

const DAYS = 7;

export function ActivityGraph() {
  const { data: messages } = useHistory(200);

  const activityData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DAYS }, (_, i) => {
      const date = subDays(today, DAYS - 1 - i);
      const count =
        messages?.filter(
          (m) => m.role === "user" && isSameDay(new Date(m.timestamp), date)
        ).length ?? 0;
      return { date, count, label: format(date, "EEE") };
    });
  }, [messages]);

  const maxCount = Math.max(...activityData.map((d) => d.count), 1);

  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p className="text-abobi-muted text-xs uppercase tracking-wider font-medium mb-4">
        7-Day Activity
      </p>

      <div className="flex items-end gap-2 h-16">
        {activityData.map((day, i) => {
          const height = day.count > 0 ? (day.count / maxCount) * 100 : 8;
          const isToday = isSameDay(day.date, new Date());

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className={`w-full rounded-t-sm ${
                  isToday
                    ? "bg-gradient-to-t from-abobi-purple to-abobi-glow"
                    : day.count > 0
                    ? "bg-abobi-purple/50"
                    : "bg-white/10"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                style={{ minHeight: 4 }}
              />
              <span
                className={`text-[10px] ${
                  isToday ? "text-white font-semibold" : "text-abobi-muted"
                }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-abobi-muted text-xs mt-3">
        {messages?.filter((m) => m.role === "user").length ?? 0} total messages
      </p>
    </GlassCard>
  );
}
