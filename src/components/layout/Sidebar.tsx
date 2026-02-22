"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useProfile } from "@/hooks/useProfile";
import { useWallet } from "@/hooks/useWallet";

const NAV_ITEMS = [
  { label: "Home", href: "/", emoji: "🏠" },
  { label: "Chat", href: "/chat", emoji: "💬" },
  { label: "Dashboard", href: "/dashboard", emoji: "📊" },
];

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { address, isDemo } = useWallet();
  const { data } = useProfile();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen p-4 gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center text-white font-black text-lg glow-sm">
          A
        </div>
        <div>
          <h1 className="text-white font-black text-xl tracking-tight">Abobi</h1>
          <p className="text-abobi-muted text-xs">Your AI Bro</p>
        </div>
      </div>

      {/* Profile card */}
      {address && (
        <div className="glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-abobi-deep to-abobi-purple flex items-center justify-center text-white font-bold">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {shortenAddress(address)}
              </p>
              <p className="text-abobi-muted text-xs">
                {isDemo ? "Demo Mode 🎭" : `${data?.streak.current ?? 0} day streak 🔥`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-abobi-purple/25 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                  active ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Wallet button at bottom */}
      <div className="mt-auto">
        <ConnectButton />
      </div>
    </aside>
  );
}
