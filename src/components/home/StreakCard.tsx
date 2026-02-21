"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useStreak } from "@/hooks/useStreak";

export function StreakCard() {
  const { streak, isLoading } = useStreak();

  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-abobi-muted text-xs uppercase tracking-wider font-medium mb-1">
            Current Streak
          </p>
          {isLoading ? (
            <LoadingDots size="sm" className="text-abobi-purple" />
          ) : (
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-4xl font-black text-white"
                key={streak?.current}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {streak?.current ?? 0}
              </motion.span>
              <span className="text-abobi-muted text-sm">days</span>
            </div>
          )}
          <p className="text-abobi-muted text-xs mt-1">
            {streak?.isActiveToday
              ? "You don gist today already!"
              : "Talk to Abobi to keep your streak"}
          </p>
        </div>
        <motion.div
          className="text-4xl"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🔥
        </motion.div>
      </div>

      {/* Streak dots */}
      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              streak && i < streak.current
                ? "bg-abobi-glow"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
