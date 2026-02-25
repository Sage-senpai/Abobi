"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { GlassCard } from "@/components/ui/GlassCard";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useProfile } from "@/hooks/useProfile";
import { useHistory } from "@/hooks/useHistory";
import { ActivityGraph } from "@/components/home/ActivityGraph";
import { LoadingDots } from "@/components/ui/LoadingDots";

interface StatConfig {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  delay: number;
  tooltip: string;
}

function StatCard({ label, value, icon, color, bgColor, borderColor, delay, tooltip }: StatConfig) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm"
      title={tooltip}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <motion.p
        className="text-[#0F172A] font-black text-3xl"
        key={String(value)}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { address } = useWallet();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: messages, isLoading: historyLoading } = useHistory(500);

  const totalMessages = messages?.length ?? 0;
  const userMessages = messages?.filter((m) => m.role === "user").length ?? 0;
  const streak = profileData?.streak.current ?? 0;
  const isLoading = profileLoading || historyLoading;

  const STATS: StatConfig[] = [
    {
      label: "Consult Streak",
      value: streak,
      tooltip: "Consecutive days you've consulted with the AI advisor",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
      color: "text-[#DC2626]",
      bgColor: "bg-[#FEF2F2]",
      borderColor: "border-[#FECACA]",
      delay: 0,
    },
    {
      label: "Questions Asked",
      value: userMessages,
      tooltip: "Total immigration questions you've asked the AI advisor",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      delay: 0.06,
    },
    {
      label: "Total Exchanges",
      value: totalMessages,
      tooltip: "All messages exchanged with your AI immigration advisor",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
      color: "text-[#16A34A]",
      bgColor: "bg-[#F0FDF4]",
      borderColor: "border-green-200",
      delay: 0.12,
    },
    {
      label: "Member Since",
      value: profileData?.profile.createdAt
        ? new Date(profileData.profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—",
      tooltip: "When you first connected and started using Abobi Legal",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      color: "text-[#D97706]",
      bgColor: "bg-[#FFFBEB]",
      borderColor: "border-amber-200",
      delay: 0.18,
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.header
        className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-[#0F172A] font-black text-xl">Case Dashboard</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Your immigration activity and progress</p>
        </div>
        <ConnectButton />
      </motion.header>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingDots className="text-[#DC2626]" />
            <p className="text-[#64748B] text-sm mt-3">Loading your case data...</p>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            {/* Activity */}
            <ActivityGraph />

            {/* Wallet & 0G info */}
            {address && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0F172A] rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">0G Network Connection</p>
                    <p className="text-[#64748B] text-xs">Decentralized AI compute & storage</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <span className="text-green-400 text-xs font-semibold">Online</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#1E293B] rounded-xl p-3">
                    <p className="text-[#64748B] text-xs mb-1">Wallet Address</p>
                    <p className="text-white font-mono text-xs truncate">{address}</p>
                  </div>
                  <div className="bg-[#1E293B] rounded-xl p-3">
                    <p className="text-[#64748B] text-xs mb-1">Network</p>
                    <p className="text-white text-xs font-semibold">0G Galileo Testnet (16602)</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "AI Inference", desc: "0G Compute" },
                    { label: "Doc Storage", desc: "0G Storage" },
                    { label: "Privacy", desc: "End-to-end" },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#1E293B] rounded-lg p-2.5">
                      <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-[#64748B] text-[10px] mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4">
              {[
                { href: "/chat", label: "Ask AI Advisor", desc: "Get immigration guidance", color: "bg-[#DC2626]" },
                { href: "/documents", label: "Manage Documents", desc: "0G secure storage", color: "bg-[#0F172A]" },
                { href: "/resources", label: "Browse Guides", desc: "Visa checklists & forms", color: "bg-[#1E293B]" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={`${link.color} rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity group`}
                  >
                    <div>
                      <p className="text-white font-bold text-sm">{link.label}</p>
                      <p className="text-white/60 text-xs mt-0.5">{link.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-white/60 ml-auto group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
