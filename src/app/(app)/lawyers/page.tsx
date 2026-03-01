"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Lawyer } from "@/types/lawyer";

const SPECIALIZATION_COLORS: Record<string, string> = {
  "Immigration": "bg-blue-100 text-blue-700",
  "Asylum": "bg-red-100 text-red-700",
  "Refugee Law": "bg-orange-100 text-orange-700",
  "Work Permits": "bg-green-100 text-green-700",
  "Family Reunification": "bg-purple-100 text-purple-700",
  "Deportation Defense": "bg-rose-100 text-rose-700",
  "Citizenship": "bg-yellow-100 text-yellow-700",
  "Student Visas": "bg-indigo-100 text-indigo-700",
};

function getSpecColor(spec: string): string {
  return SPECIALIZATION_COLORS[spec] ?? "bg-slate-100 text-slate-600";
}

async function fetchLawyers(): Promise<Lawyer[]> {
  const res = await fetch("/api/lawyers");
  if (!res.ok) throw new Error("Failed to load lawyers");
  const data = await res.json() as { lawyers: Lawyer[] };
  return data.lawyers;
}

export default function LawyersPage() {
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("");

  const { data: lawyers = [], isLoading, error } = useQuery({
    queryKey: ["lawyers"],
    queryFn: fetchLawyers,
    staleTime: 60_000,
  });

  const filtered = lawyers.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.fullName.toLowerCase().includes(q) ||
      l.jurisdiction.toLowerCase().includes(q) ||
      l.languages.some((lang) => lang.toLowerCase().includes(q));
    const matchesSpec =
      !filterSpec || l.specializations.includes(filterSpec);
    return matchesSearch && matchesSpec;
  });

  const allSpecs = Array.from(
    new Set(lawyers.flatMap((l) => l.specializations))
  ).sort();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A]">Verified Lawyers</h1>
              <p className="text-[#64748B] text-sm mt-1">
                Accredited immigration lawyers verified by Abobi Legal
              </p>
            </div>
            <Link
              href="/lawyers/apply"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Apply for Verification
            </Link>
          </div>

          {/* Search + filter */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={8} />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, jurisdiction, language…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
            {allSpecs.length > 0 && (
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="px-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-[#DC2626] transition-colors"
              >
                <option value="">All specializations</option>
                {allSpecs.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-[#94A3B8]">
            <div className="w-5 h-5 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading lawyers…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Failed to load lawyers. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-[#0F172A] font-semibold">
              {lawyers.length === 0 ? "No verified lawyers yet" : "No results found"}
            </p>
            <p className="text-[#64748B] text-sm mt-1">
              {lawyers.length === 0
                ? "Be the first to apply for lawyer verification"
                : "Try adjusting your search or filter"}
            </p>
            {lawyers.length === 0 && (
              <Link
                href="/lawyers/apply"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors"
              >
                Apply Now
              </Link>
            )}
          </div>
        )}

        {/* Lawyer grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lawyer, i) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#DC2626]/30 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626] font-black text-lg flex-shrink-0">
                    {lawyer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[#0F172A] font-bold text-sm truncate">{lawyer.fullName}</p>
                      <svg className="w-4 h-4 text-[#DC2626] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-[#64748B] text-xs mt-0.5">{lawyer.jurisdiction}</p>
                  </div>
                </div>

                {/* Bio */}
                {lawyer.bio && (
                  <p className="text-[#475569] text-xs leading-relaxed line-clamp-2 mb-3">
                    {lawyer.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 mb-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lawyer.yearsExperience}yr{lawyer.yearsExperience !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {lawyer.languages.slice(0, 2).join(", ")}
                    {lawyer.languages.length > 2 && ` +${lawyer.languages.length - 2}`}
                  </span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5">
                  {lawyer.specializations.slice(0, 3).map((spec) => (
                    <span key={spec} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getSpecColor(spec)}`}>
                      {spec}
                    </span>
                  ))}
                  {lawyer.specializations.length > 3 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      +{lawyer.specializations.length - 3} more
                    </span>
                  )}
                </div>

                {/* Website link */}
                {lawyer.website && (
                  <a
                    href={lawyer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 mt-3 text-xs text-[#DC2626] hover:underline"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit website
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!isLoading && lawyers.length > 0 && (
          <p className="text-center text-[#94A3B8] text-xs mt-6">
            {filtered.length} of {lawyers.length} verified lawyer{lawyers.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
