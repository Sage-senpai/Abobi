"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { GlassCard } from "@/components/ui/GlassCard";

function getPidginGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! E don bright";
  if (hour < 17) return "Good afternoon! How afternoon dey treat you?";
  return "Good evening! You don rest?";
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function GreetingCard() {
  const { address, isDemo } = useWallet();

  return (
    <GlassCard
      glow
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Abobi Avatar */}
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center text-xl font-bold text-white glow-sm"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          A
        </motion.div>
        <div>
          <p className="text-xs text-abobi-muted font-medium uppercase tracking-wider">
            Abobi AI Bro
          </p>
          <p className="text-white font-semibold text-sm">
            {isDemo ? "Demo User 🎭" : address ? shortenAddress(address) : "Anonymous"}
          </p>
        </div>
      </div>

      <p className="text-abobi-text text-lg font-medium leading-snug">
        {getPidginGreeting()},<br />
        <span className="text-white font-bold">wetin dey?</span>
      </p>
      <p className="text-abobi-muted text-sm mt-2">
        Your Pidgin AI bro dey here for you. Gist me anything.
      </p>
    </GlassCard>
  );
}
