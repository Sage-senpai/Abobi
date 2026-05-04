"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useWallet } from "@/hooks/useWallet";

/* ── Navigation items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/",
    tooltip: "Your case status and quick actions",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "AI Advisor",
    href: "/chat",
    tooltip: "Chat with your immigration AI advisor",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: "Documents",
    href: "/documents",
    tooltip: "Securely store documents on 0G blockchain",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Resources",
    href: "/resources",
    tooltip: "Immigration guides, checklists and forms",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "My Cases",
    href: "/cases",
    tooltip: "Track your visa applications and their status",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Embassies",
    href: "/embassies",
    tooltip: "Embassy and consulate directory with hotlines",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
      </svg>
    ),
  },
  {
    label: "Lawyers",
    href: "/lawyers",
    tooltip: "Find verified immigration lawyers",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    tooltip: "Your case history and statistics",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { address, isDemo } = useWallet();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0F172A] border-r border-[#1E293B] flex-shrink-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-[3px] border-[#DC2626] flex items-center justify-center shadow-lg bg-[#1E293B]">
            <span className="text-white font-black text-[9px] tracking-wide">Viza</span>
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-tight">ZeroViza</h1>
            <p className="text-[#64748B] text-xs">AI Immigration Legal Aid</p>
          </div>
        </div>
      </div>

      {/* User profile */}
      {address && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-[#1E293B] border border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30 flex items-center justify-center text-[#DC2626] font-bold text-sm flex-shrink-0">
              {isDemo ? "D" : address.slice(2, 4).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {isDemo ? "Demo User" : shortenAddress(address)}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[dot-pulse_2s_ease-in-out_infinite]" />
                <span className="text-[#64748B] text-xs">
                  {isDemo ? "Demo Mode" : "0G Aristotle"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[#475569] text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.tooltip}
              className="relative block"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#DC2626] rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className={`relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active
                    ? "text-white"
                    : "text-[#64748B] hover:text-white hover:bg-[#1E293B]"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 0G Network badge */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-[#1E293B] border border-[#334155]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0" />
          <p className="text-white text-xs font-semibold">Powered by 0G</p>
        </div>
        <p className="text-[#475569] text-[10px] leading-relaxed">
          Decentralized AI compute + tamper-proof document storage
        </p>
      </div>

      {/* Wallet */}
      <div className="px-4 pb-6">
        <ConnectButton />
      </div>
    </aside>
  );
}
