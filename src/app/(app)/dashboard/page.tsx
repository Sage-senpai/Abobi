"use client";

import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useProfile } from "@/hooks/useProfile";
import { useHistory } from "@/hooks/useHistory";
import { ActivityGraph } from "@/components/home/ActivityGraph";
import { LoadingDots } from "@/components/ui/LoadingDots";

function StatCard({ label, value, emoji, delay }: { label: string; value: string | number; emoji: string; delay: number }) {
  return (
    <GlassCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-abobi-muted text-xs uppercase tracking-wider font-medium mb-2">
            {label}
          </p>
          <p className="text-white font-black text-3xl">{value}</p>
        </div>
        <span className="text-2xl">{emoji}</span>
      </div>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const { address } = useAccount();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: messages, isLoading: historyLoading } = useHistory(500);

  const totalMessages = messages?.length ?? 0;
  const userMessages = messages?.filter((m) => m.role === "user").length ?? 0;
  const streak = profileData?.streak.current ?? 0;

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-white font-black text-2xl">Dashboard</h1>
          <p className="text-abobi-muted text-sm mt-1">
            Your Abobi activity at a glance
          </p>
        </div>
        <ConnectButton />
      </motion.div>

      {/* Stats grid */}
      {profileLoading || historyLoading ? (
        <div className="flex justify-center py-12">
          <LoadingDots className="text-abobi-purple" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Streak" value={streak} emoji="🔥" delay={0} />
            <StatCard label="Messages Sent" value={userMessages} emoji="💬" delay={0.05} />
            <StatCard label="Total Chats" value={totalMessages} emoji="📚" delay={0.1} />
            <StatCard
              label="Member Since"
              value={profileData?.profile.createdAt
                ? new Date(profileData.profile.createdAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
                : "—"}
              emoji="📅"
              delay={0.15}
            />
          </div>

          {/* Activity chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ActivityGraph />
          </motion.div>

          {/* Wallet info */}
          {address && (
            <GlassCard
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-abobi-muted text-xs uppercase tracking-wider font-medium mb-1">
                    Connected Wallet
                  </p>
                  <p className="text-white font-mono text-sm">{address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-abobi-muted text-xs">
                    0G Galileo Testnet
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
