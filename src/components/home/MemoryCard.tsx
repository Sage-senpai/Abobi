"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useHistory } from "@/hooks/useHistory";

export function MemoryCard() {
  const { data: messages, isLoading } = useHistory(5);

  const lastMessage = messages?.filter((m) => m.role === "assistant").at(-1);
  const totalQueries = messages?.filter((m) => m.role === "user").length ?? 0;

  return (
    <GlassCard
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">
          Case Queries
        </p>
        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-blue-200 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <LoadingDots size="sm" className="text-[#64748B]" />
      ) : (
        <motion.div
          key={totalQueries}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#0F172A]">{totalQueries}</span>
            <span className="text-[#64748B] text-sm">asked</span>
          </div>
        </motion.div>
      )}

      <p className="text-[#94A3B8] text-[11px] mt-1.5 line-clamp-2">
        {lastMessage
          ? lastMessage.content.slice(0, 60) + "…"
          : "No consultations yet"}
      </p>
    </GlassCard>
  );
}
