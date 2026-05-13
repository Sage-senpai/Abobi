"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useWallet } from "@/hooks/useWallet";

type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon: React.ReactNode;
};

const PRIMARY_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Advisor",
    href: "/chat",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: "Cases",
    href: "/cases",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Docs",
    href: "/documents",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const OVERFLOW_ITEMS: NavItem[] = [
  {
    label: "Lawyers",
    href: "/lawyers",
    description: "On-chain verified immigration lawyers",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    label: "Embassies",
    href: "/embassies",
    description: "22 missions with hotlines and appointment links",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
      </svg>
    ),
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Immigration guides, checklists and forms",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Case history and analytics",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Apply as Lawyer",
    href: "/lawyers/apply",
    description: "Get verified on the 0G LawyerRegistry",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM19 8v3m1.5-1.5h-3" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();
  const { address, isDemo } = useWallet();
  const [open, setOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const moreActive = OVERFLOW_ITEMS.some((item) => isActive(pathname, item.href));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden">
        <div className="bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(15,23,42,0.08)]">
          <div className="flex px-1">
            {PRIMARY_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 relative"
                >
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute top-0 left-1 right-1 h-0.5 bg-[#DC2626] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`transition-colors ${
                      active ? "text-[#DC2626]" : "text-[#94A3B8] hover:text-[#64748B]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-[9px] font-semibold tracking-wide transition-colors ${
                      active ? "text-[#DC2626]" : "text-[#94A3B8]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open more navigation"
              aria-expanded={open}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 relative"
            >
              {moreActive && !open && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute top-0 left-1 right-1 h-0.5 bg-[#DC2626] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`transition-colors ${
                  moreActive || open ? "text-[#DC2626]" : "text-[#94A3B8]"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
              </span>
              <span
                className={`text-[9px] font-semibold tracking-wide transition-colors ${
                  moreActive || open ? "text-[#DC2626]" : "text-[#94A3B8]"
                }`}
              >
                More
              </span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[60] bg-[#0F172A]/55 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="More navigation"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-[70] safe-bottom lg:hidden"
            >
              <div className="mx-2 mb-2 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden">
                <div className="flex flex-col items-center pt-2.5 pb-1">
                  <span className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
                </div>

                <div className="px-4 pt-2 pb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
                      Navigation
                    </p>
                    <h2 className="text-[#0F172A] font-bold text-base">More</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-2 pb-2 space-y-0.5">
                  {OVERFLOW_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                          active
                            ? "bg-[#DC2626]/10 text-[#DC2626]"
                            : "text-[#0F172A] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            active ? "bg-[#DC2626]/15 text-[#DC2626]" : "bg-[#F1F5F9] text-[#64748B]"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm leading-tight">{item.label}</p>
                          {item.description && (
                            <p className="text-[11px] text-[#64748B] leading-snug mt-0.5 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
                        Wallet
                      </p>
                      <p className="text-xs text-[#0F172A] font-semibold truncate">
                        {address
                          ? isDemo
                            ? "Demo Mode"
                            : `${address.slice(0, 6)}...${address.slice(-4)}`
                          : "Not connected"}
                      </p>
                    </div>
                    {address && !isDemo && (
                      <span className="flex items-center gap-1.5 text-[10px] text-[#64748B] flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[dot-pulse_2s_ease-in-out_infinite]" />
                        0G Aristotle
                      </span>
                    )}
                  </div>
                  <ConnectButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
