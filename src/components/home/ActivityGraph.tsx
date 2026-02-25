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
  const totalQueries = messages?.filter((m) => m.role === "user").length ?? 0;

  return (
    <GlassCard
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
            7-Day Consultation Activity
          </p>
          <p className="text-[#0F172A] font-bold text-lg mt-0.5">
            {totalQueries} <span className="text-[#64748B] font-normal text-sm">total queries</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#DC2626]" />Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#FCA5A5]" />Active
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-20">
        {activityData.map((day, i) => {
          const height = day.count > 0 ? Math.max((day.count / maxCount) * 100, 15) : 8;
          const isToday = isSameDay(day.date, new Date());

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5" title={`${day.label}: ${day.count} queries`}>
              <motion.div
                className={`w-full rounded-t-sm ${
                  isToday
                    ? "bg-[#DC2626]"
                    : day.count > 0
                    ? "bg-[#FCA5A5]"
                    : "bg-[#F1F5F9]"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ minHeight: 4 }}
              />
              <span
                className={`text-[9px] font-semibold ${
                  isToday ? "text-[#DC2626]" : "text-[#94A3B8]"
                }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
