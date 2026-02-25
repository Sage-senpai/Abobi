"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useStreak } from "@/hooks/useStreak";

export function StreakCard() {
  const { streak, isLoading } = useStreak();

  return (
    <GlassCard
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
          Consultation Streak
        </p>
        <div className="w-7 h-7 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-sm">
          🔥
        </div>
      </div>

      {isLoading ? (
        <LoadingDots size="sm" className="text-[#DC2626]" />
      ) : (
        <motion.div
          key={streak?.current}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#0F172A]">
              {streak?.current ?? 0}
            </span>
            <span className="text-[#64748B] text-sm">days</span>
          </div>
        </motion.div>
      )}

      <p className="text-[#94A3B8] text-[11px] mt-1.5">
        {streak?.isActiveToday
          ? "Active today — great work!"
          : "Start a conversation to continue"}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 h-1 rounded-full ${
              streak && i < streak.current
                ? "bg-[#DC2626]"
                : "bg-[#F1F5F9]"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
          />
        ))}
      </div>
    </GlassCard>
  );
}
