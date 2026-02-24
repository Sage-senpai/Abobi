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
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0F172A] border-r border-[#1E293B] flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-black text-lg tracking-tight">Abobi Legal</h1>
            <p className="text-[#64748B] text-xs">AI Immigration Advisor</p>
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
                  {isDemo ? "Demo Mode" : "0G Galileo"}
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
