"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useDemoStore } from "@/store/demoStore";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI-Powered Guidance",
    desc: "Get step-by-step immigration advice in your language — English, Spanish, French, Hausa, Yoruba and more.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Tamper-Proof Documents",
    desc: "Upload passports, IDs and forms. Stored on 0G blockchain — verifiable by lawyers and authorities.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: "Connect to Lawyers",
    desc: "Matched with vetted pro bono lawyers and NGOs for free or low-cost professional legal support.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Eligibility Checks",
    desc: "Instant visa eligibility analysis for US, Canada, UK, EU, and Nigerian immigration pathways.",
  },
];

const TRUST_BADGES = ["USCIS Guidelines", "EU Home Office", "Nigerian Immigration", "UNHCR Standards"];

export default function ConnectPage() {
  const { address, status } = useAccount();
  const router = useRouter();
  const { isDemoMode, enableDemo } = useDemoStore();

  useEffect(() => {
    if (isDemoMode || (status === "connected" && address)) {
      router.replace("/");
    }
  }, [address, status, isDemoMode, router]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] relative overflow-hidden">
      <WaveBackground />

      {/* ── Left panel — hero ──────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0F172A] p-12 relative overflow-hidden">
        {/* Decorative red glow */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span className="text-white font-black text-xl">Abobi Legal</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Your Rights.
              <br />
              <span className="text-[#DC2626]">Our Mission.</span>
            </h1>
            <p className="text-[#94A3B8] text-lg leading-relaxed max-w-md">
              AI-powered immigration legal guidance for underserved communities worldwide. Free, confidential, and available in your language.
            </p>
          </motion.div>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#DC2626]/15 border border-[#DC2626]/25 flex items-center justify-center text-[#DC2626] flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{f.title}</p>
                <p className="text-[#64748B] text-xs leading-relaxed mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <div className="relative z-10">
          <p className="text-[#475569] text-xs mb-3 font-medium uppercase tracking-wider">
            Aligned with official sources
          </p>
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map((b) => (
              <span key={b} className="text-[10px] text-[#64748B] border border-[#334155] px-2.5 py-1 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — sign in ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span className="text-[#0F172A] font-black text-xl">Abobi Legal</span>
          </div>

          <h2 className="text-3xl font-black text-[#0F172A] mb-2">Get started</h2>
          <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
            Connect your wallet to access free, confidential AI immigration guidance. No email, no personal data stored.
          </p>

          {/* Animated indicator */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-green-200 mb-8">
            <div className="relative flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-green-500 flex" />
              <span className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-60" />
            </div>
            <p className="text-green-800 text-sm font-medium">
              Service active — 0G Compute online
            </p>
          </div>

          {/* Connect wallet */}
          <div className="space-y-3">
            <ConnectButton />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[#94A3B8] text-xs">or</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <button
              onClick={enableDemo}
              className="w-full py-3 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] text-sm font-semibold hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all duration-200"
            >
              Try Demo — No wallet needed
            </button>
          </div>

          {/* Legal disclaimer */}
          <p className="text-[#94A3B8] text-xs text-center mt-8 leading-relaxed">
            Abobi provides <strong>general legal information only</strong>, not legal advice.
            Always consult a qualified immigration attorney for your specific case.
          </p>

          {/* Language pills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-6">
            {["EN", "ES", "FR", "HA", "YO", "IG", "PT"].map((lang) => (
              <span key={lang} className="text-[10px] text-[#94A3B8] border border-[#E2E8F0] px-2 py-0.5 rounded font-mono">
                {lang}
              </span>
            ))}
          </div>
          <p className="text-[#94A3B8] text-[10px] text-center mt-1.5">Available in 7 languages</p>
        </motion.div>
      </div>
    </div>
  );
}
