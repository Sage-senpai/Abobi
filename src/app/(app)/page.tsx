"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { GreetingCard } from "@/components/home/GreetingCard";
import { StreakCard } from "@/components/home/StreakCard";
import { MemoryCard } from "@/components/home/MemoryCard";
import { ActivityGraph } from "@/components/home/ActivityGraph";
import { GradientButton } from "@/components/ui/GradientButton";
import { useUserStore } from "@/store/userStore";

export default function HomePage() {
  const { address } = useAccount();
  const setWalletAddress = useUserStore((s) => s.setWalletAddress);

  useEffect(() => {
    setWalletAddress(address ?? null);
  }, [address, setWalletAddress]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4 max-w-lg mx-auto w-full lg:max-w-2xl">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-white font-bold text-xl">How far!</h2>
        <span className="text-abobi-muted text-sm">
          {new Date().toLocaleDateString("en-NG", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </motion.div>

      {/* Cards */}
      <GreetingCard />

      <div className="grid grid-cols-2 gap-4">
        <StreakCard />
        <MemoryCard />
      </div>

      <ActivityGraph />

      {/* CTA */}
      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link href="/chat" className="block">
          <GradientButton size="lg" className="w-full justify-center">
            Start Gisting with Abobi 💬
          </GradientButton>
        </Link>
      </motion.div>
    </div>
  );
}
