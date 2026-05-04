"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EMBASSIES, listRepresentingCountries, listHostCountries } from "@/data/embassies";
import type { Embassy } from "@/types/embassy";

const TYPE_LABELS: Record<Embassy["type"], string> = {
  embassy: "Embassy",
  consulate: "Consulate",
  "high-commission": "High Commission",
  "visa-center": "Visa Center",
};

const TYPE_COLORS: Record<Embassy["type"], string> = {
  embassy: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  consulate: "bg-blue-50 text-blue-700 border-blue-200",
  "high-commission": "bg-purple-50 text-purple-700 border-purple-200",
  "visa-center": "bg-amber-50 text-amber-700 border-amber-200",
};

function EmbassyCard({ embassy, index }: { embassy: Embassy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#DC2626] transition-all"
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-3xl flex-shrink-0">{embassy.flag}</span>
          <div className="min-w-0">
            <h3 className="text-[#0F172A] font-bold text-base truncate">
              {embassy.representingCountry}
            </h3>
            <p className="text-[#64748B] text-xs">
              in {embassy.hostCity}, {embassy.hostCountry}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border flex-shrink-0 ${TYPE_COLORS[embassy.type]}`}>
          {TYPE_LABELS[embassy.type]}
        </span>
      </div>

      <p className="text-[#475569] text-xs leading-relaxed mb-3">{embassy.address}</p>

      {embassy.jurisdictionNotes && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-900 text-[11px] leading-relaxed">
            <span className="font-bold">Note:</span> {embassy.jurisdictionNotes}
          </p>
        </div>
      )}

      <div className="space-y-1.5 mb-3">
        {embassy.phone && (
          <a
            href={`tel:${embassy.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-xs text-[#0F172A] hover:text-[#DC2626] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-mono">{embassy.phone}</span>
          </a>
        )}
        {embassy.email && (
          <a
            href={`mailto:${embassy.email}`}
            className="flex items-center gap-2 text-xs text-[#0F172A] hover:text-[#DC2626] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{embassy.email}</span>
          </a>
        )}
        {embassy.hours && (
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <svg className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{embassy.hours}</span>
          </div>
        )}
      </div>

      {embassy.servicesOffered.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {embassy.servicesOffered.slice(0, 4).map((s) => (
            <span key={s} className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] rounded-md px-2 py-0.5">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F1F5F9]">
        {embassy.appointmentUrl && (
          <a
            href={embassy.appointmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] text-white text-xs font-semibold rounded-lg hover:bg-[#B91C1C] transition-colors"
          >
            Book appointment
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
        {embassy.website && (
          <a
            href={embassy.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] text-[#475569] text-xs font-semibold rounded-lg hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
          >
            Website
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function EmbassiesPage() {
  const [query, setQuery] = useState("");
  const [representing, setRepresenting] = useState<string>("");
  const [host, setHost] = useState<string>("");

  const representingCountries = useMemo(() => listRepresentingCountries(), []);
  const hostCountries = useMemo(() => listHostCountries(), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return EMBASSIES.filter((e) => {
      if (representing && e.representingCountry !== representing) return false;
      if (host && e.hostCountry !== host) return false;
      if (q) {
        const hay = `${e.representingCountry} ${e.hostCountry} ${e.hostCity} ${e.servicesOffered.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, representing, host]);

  const clearFilters = () => {
    setQuery("");
    setRepresenting("");
    setHost("");
  };

  const hasFilters = query || representing || host;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A]">Embassy &amp; Consulate Directory</h1>
              <p className="text-[#64748B] text-sm mt-1">
                Verified diplomatic missions with appointment links and direct hotlines
              </p>
            </div>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-xl hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Ask the AI
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <svg className="w-4 h-4 text-[#94A3B8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] text-[#64748B]">
              Always confirm hours and appointment availability on the official website before traveling. Information is updated periodically.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, service..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
            />
          </div>
          <select
            value={representing}
            onChange={(e) => setRepresenting(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
          >
            <option value="">Any visa destination</option>
            {representingCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
          >
            <option value="">Any host country</option>
            {hostCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[#64748B] text-xs">
            <span className="font-bold text-[#0F172A]">{filtered.length}</span> mission{filtered.length === 1 ? "" : "s"} found
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-[#DC2626] text-xs font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
            <p className="text-[#0F172A] font-bold text-sm mb-1">No missions match your filters</p>
            <p className="text-[#64748B] text-xs mb-4">Try widening your search or asking the AI advisor for guidance.</p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] text-white text-xs font-semibold rounded-lg hover:bg-[#B91C1C] transition-colors"
            >
              Ask the AI advisor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((e, i) => (
              <EmbassyCard key={e.id} embassy={e} index={i} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 px-4 py-3 bg-[#0F172A] rounded-xl">
          <p className="text-white text-xs font-bold mb-1">Don't see your country?</p>
          <p className="text-[#94A3B8] text-[11px] leading-relaxed">
            The directory is being expanded. Ask the AI advisor for embassy contact info for any country, and the response will include phone, email, and the official appointment URL.
          </p>
        </div>
      </div>
    </div>
  );
}
