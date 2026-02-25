"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { GlassCard } from "@/components/ui/GlassCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function GreetingCard() {
  const { address, isDemo } = useWallet();

  return (
    <GlassCard
      glow
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Red accent corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC2626] opacity-[0.04] rounded-full translate-x-12 -translate-y-12" />

      <div className="flex items-start gap-4">
        {/* AI avatar */}
        <motion.div
          className="w-14 h-14 rounded-2xl bg-[#DC2626] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-0.5">
            Abobi Legal AI
          </p>
          <h2 className="text-[#0F172A] font-black text-xl leading-tight">
            {getGreeting()}{address && !isDemo ? `, ${shortenAddress(address)}` : ""}
          </h2>
          <p className="text-[#64748B] text-sm mt-1.5 leading-relaxed">
            I&apos;m your AI immigration advisor. Ask about visas, asylum, work permits, family reunification, or document requirements.
          </p>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs text-[#64748B] font-medium">AI Online</span>
        </div>
        <div className="w-px h-3 bg-[#E2E8F0]" />
        <span className="text-xs text-[#64748B]">0G Compute Active</span>
        <div className="w-px h-3 bg-[#E2E8F0]" />
        <span className="text-xs text-[#64748B] italic">Not legal advice</span>
      </div>
    </GlassCard>
  );
}
