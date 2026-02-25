"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { GreetingCard } from "@/components/home/GreetingCard";
import { StreakCard } from "@/components/home/StreakCard";
import { MemoryCard } from "@/components/home/MemoryCard";
import { ActivityGraph } from "@/components/home/ActivityGraph";
import { QuickActions } from "@/components/immigration/QuickActions";
import { PolicyAlertsStrip } from "@/components/immigration/PolicyAlertsStrip";
import { GradientButton } from "@/components/ui/GradientButton";
import { useUserStore } from "@/store/userStore";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export default function HomePage() {
  const { address } = useWallet();
  const setWalletAddress = useUserStore((s) => s.setWalletAddress);

  useEffect(() => {
    setWalletAddress(address ?? null);
  }, [address, setWalletAddress]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Top header bar ─────────────────────────────────────────────── */}
      <motion.header
        className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-[#0F172A] font-black text-xl">Immigration Hub</h1>
          <p className="text-[#64748B] text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <ConnectButton />
      </motion.header>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">

        {/* Welcome card */}
        <GreetingCard />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <StreakCard />
          <MemoryCard />
        </div>

        {/* Policy Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-4"
        >
          <PolicyAlertsStrip />
        </motion.div>

        {/* Quick action buttons */}
        <QuickActions />

        {/* Activity */}
        <ActivityGraph />

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pb-4"
        >
          <Link href="/chat" className="block">
            <GradientButton size="lg" className="w-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ask Your AI Immigration Advisor
            </GradientButton>
          </Link>
          <p className="text-[#94A3B8] text-xs text-center mt-2">
            Free, confidential guidance · Powered by 0G decentralized compute
          </p>
        </motion.div>
      </div>
    </div>
  );
}
