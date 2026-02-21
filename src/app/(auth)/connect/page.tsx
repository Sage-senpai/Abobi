"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export default function ConnectPage() {
  const { address, status } = useAccount();
  const router = useRouter();

  // Only redirect once the connection is fully confirmed — not during
  // the transient "reconnecting" state, which would cause a loop.
  useEffect(() => {
    if (status === "connected" && address) {
      router.replace("/dashboard");
    }
  }, [address, status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <WaveBackground />

      <motion.div
        className="w-full max-w-sm flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-abobi-deep via-abobi-purple to-abobi-glow flex items-center justify-center glow-purple"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-5xl font-black text-white">A</span>
        </motion.div>

        {/* Headline */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            Abobi
          </h1>
          <p className="text-abobi-muted text-base leading-relaxed">
            Your decentralized Pidgin AI bro.{" "}
            <span className="text-white/70">Na only you get your gist.</span>
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["🔐 Privacy-First", "🌍 Pidgin Native", "⚡ 0G Powered"].map(
            (pill) => (
              <span
                key={pill}
                className="glass-sm text-white/70 text-xs px-3 py-1.5 font-medium"
              >
                {pill}
              </span>
            )
          )}
        </div>

        {/* Connect */}
        <div className="w-full flex flex-col items-center gap-4">
          <ConnectButton />
          <p className="text-abobi-muted text-xs text-center max-w-xs">
            Connect your wallet to begin. No email, no password — just you and Abobi.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
