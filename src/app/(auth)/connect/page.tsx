"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useDemoStore } from "@/store/demoStore";

export default function ConnectPage() {
  const { address, status } = useAccount();
  const router = useRouter();
  const { isDemoMode, enableDemo } = useDemoStore();

  // Redirect if already connected (real wallet or demo)
  useEffect(() => {
    if (isDemoMode || (status === "connected" && address)) {
      router.replace("/dashboard");
    }
  }, [address, status, isDemoMode, router]);

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
        <div className="w-full flex flex-col items-center gap-3">
          <ConnectButton />

          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={enableDemo}
            className="w-full py-3 rounded-2xl border border-white/15 text-white/60 text-sm font-medium hover:border-abobi-purple/60 hover:text-white/80 hover:bg-abobi-purple/10 transition-all"
          >
            Try Demo Mode
          </button>

          <p className="text-abobi-muted text-xs text-center max-w-xs">
            Connect your wallet to begin. No email, no password — just you and Abobi.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
