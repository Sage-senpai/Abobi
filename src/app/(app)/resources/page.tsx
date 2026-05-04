"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { GUIDES, PROCESSING_TIMES } from "@/data/guides";


const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Work": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  "Family": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  "Asylum": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  "Urgent": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  "Student": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  "Permanent Residence": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  "Points-based": { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  "Digital Nomad": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  "default": { bg: "bg-[#F8FAFC]", border: "border-[#E2E8F0]", text: "text-[#64748B]" },
};

const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Difficult: "bg-red-100 text-red-700 border-red-200",
};

function getTagStyle(tag: string) {
  return CATEGORY_COLORS[tag] ?? CATEGORY_COLORS["default"];
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedGuide, setExpandedGuide] = useState<string | null>("us");
  const [showTimes, setShowTimes] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filters = ["all", "Work", "Family", "Asylum", "Student", "Permanent Residence"];

  const filteredGuides = GUIDES.map((guide) => ({
    ...guide,
    articles: activeFilter === "all"
      ? guide.articles
      : guide.articles.filter((a) => a.tags.some((t) => t === activeFilter)),
  })).filter((g) => g.articles.length > 0);

  const toggleArticle = (guideId: string, articleTitle: string) => {
    const key = `${guideId}::${articleTitle}`;
    setExpandedArticle(expandedArticle === key ? null : key);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <motion.header
        className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-[#0F172A] font-black text-xl">Immigration Guides</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {GUIDES.length} countries · {GUIDES.reduce((a, g) => a + g.articles.length, 0)} guides · Official sources
          </p>
        </div>
        <ConnectButton />
      </motion.header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBEB] border border-amber-200 rounded-2xl px-4 py-3 flex gap-3"
        >
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>For information only.</strong> Immigration laws change frequently. Always verify with official government sources or a licensed attorney. Use the AI Advisor for personalised guidance.
          </p>
        </motion.div>

        {/* Processing Times Panel */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
        >
          <button
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-colors text-left"
            onClick={() => setShowTimes(!showTimes)}
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[#0F172A] font-bold text-base">Processing Times &amp; Fees</h2>
              <p className="text-[#64748B] text-xs">{PROCESSING_TIMES.length} countries · Approximate estimates · Updated 2025</p>
            </div>
            <motion.svg
              className="w-5 h-5 text-[#94A3B8] flex-shrink-0"
              animate={{ rotate: showTimes ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {showTimes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-[#F1F5F9]"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="text-left px-5 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Country</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Visa Type</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Time</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Fee</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROCESSING_TIMES.map((entry, i) => (
                        <motion.tr
                          key={entry.country}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FEF2F2]/20 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{entry.flag}</span>
                              <span className="text-[#0F172A] font-semibold text-sm">{entry.country}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[#64748B] text-xs hidden sm:table-cell">{entry.visaType}</td>
                          <td className="px-3 py-3 text-[#0F172A] font-semibold text-xs">{entry.time}</td>
                          <td className="px-3 py-3 text-[#64748B] text-xs hidden md:table-cell">{entry.fee}</td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[entry.difficulty]}`}>
                              {entry.difficulty}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[#94A3B8] text-[10px] px-5 py-3 border-t border-[#F1F5F9]">
                  * Processing times are approximate and vary by applicant profile, consulate workload, and season. Government fees only — attorney and service fees are additional.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-[#DC2626] text-white shadow-sm"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#DC2626] hover:text-[#DC2626]"
              }`}
            >
              {f === "all" ? "All Guides" : f}
            </button>
          ))}
        </motion.div>

        {/* Country count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[#64748B] text-xs"
        >
          Showing <strong className="text-[#0F172A]">{filteredGuides.length}</strong> countries
          {activeFilter !== "all" && <> with <strong className="text-[#DC2626]">{activeFilter}</strong> visas</>}
        </motion.p>

        {/* Guides */}
        <div className="space-y-3">
          {filteredGuides.map((guide, gi) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + gi * 0.04 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
            >
              {/* Section header */}
              <button
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-colors text-left"
                onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
              >
                <span className="text-2xl">{guide.flag}</span>
                <div className="flex-1">
                  <h2 className="text-[#0F172A] font-bold text-base">{guide.title}</h2>
                  <p className="text-[#64748B] text-xs">{guide.articles.length} guide{guide.articles.length !== 1 ? "s" : ""} · {guide.category}</p>
                </div>
                <motion.svg
                  className="w-5 h-5 text-[#94A3B8] flex-shrink-0"
                  animate={{ rotate: expandedGuide === guide.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Articles */}
              <AnimatePresence>
                {expandedGuide === guide.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-[#F1F5F9]"
                  >
                    {guide.articles.map((article, ai) => {
                      const articleKey = `${guide.id}::${article.title}`;
                      const isExpanded = expandedArticle === articleKey;
                      return (
                        <motion.div
                          key={article.title}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ai * 0.04 }}
                          className="border-b border-[#F1F5F9] last:border-b-0"
                        >
                          {/* Article header (clickable) */}
                          <button
                            className="w-full px-5 py-4 hover:bg-[#FEF2F2]/30 transition-colors text-left group"
                            onClick={() => toggleArticle(guide.id, article.title)}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-[#0F172A] font-semibold text-sm group-hover:text-[#DC2626] transition-colors">
                                {article.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                <span className="text-[10px] text-[#94A3B8]">{article.readTime} read</span>
                                <span className="text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded-md">{article.lastUpdated}</span>
                                <motion.svg
                                  className="w-4 h-4 text-[#94A3B8]"
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                              </div>
                            </div>
                            <p className="text-[#64748B] text-sm leading-relaxed mb-2.5">{article.summary}</p>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {article.tags.map((tag) => {
                                const style = getTagStyle(tag);
                                return (
                                  <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          </button>

                          {/* Expanded article content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-0">
                                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
                                    {/* Content rendered as paragraphs */}
                                    <div className="text-[#334155] text-sm leading-relaxed">
                                      {article.content.split("\n\n").map((paragraph, pi) => {
                                        const trimmed = paragraph.trim();
                                        if (!trimmed) return null;
                                        // Detect section headers (ALL CAPS lines)
                                        if (/^[A-Z][A-Z &\-\/()0-9]+$/.test(trimmed.split("\n")[0])) {
                                          const lines = trimmed.split("\n");
                                          const header = lines[0];
                                          const rest = lines.slice(1).join("\n").trim();
                                          return (
                                            <div key={pi} className="mt-2">
                                              <h4 className="text-[#0F172A] font-bold text-xs uppercase tracking-wide mb-1.5">{header}</h4>
                                              {rest && rest.split("\n").map((line, li) => {
                                                const l = line.trim();
                                                if (l.startsWith("- ")) {
                                                  return (
                                                    <div key={li} className="flex gap-2 ml-1 mb-1">
                                                      <span className="text-[#DC2626] mt-1 flex-shrink-0">&#8226;</span>
                                                      <span>{l.slice(2)}</span>
                                                    </div>
                                                  );
                                                }
                                                if (l.match(/^\d+\./)) {
                                                  return (
                                                    <div key={li} className="flex gap-2 ml-1 mb-1">
                                                      <span className="text-[#DC2626] font-semibold flex-shrink-0">{l.split(".")[0]}.</span>
                                                      <span>{l.slice(l.indexOf(".") + 2)}</span>
                                                    </div>
                                                  );
                                                }
                                                return <p key={li} className="mb-1">{l}</p>;
                                              })}
                                            </div>
                                          );
                                        }
                                        // Regular paragraphs with bullet/numbered list handling
                                        return (
                                          <div key={pi}>
                                            {trimmed.split("\n").map((line, li) => {
                                              const l = line.trim();
                                              if (l.startsWith("- ")) {
                                                return (
                                                  <div key={li} className="flex gap-2 ml-1 mb-1">
                                                    <span className="text-[#DC2626] mt-1 flex-shrink-0">&#8226;</span>
                                                    <span>{l.slice(2)}</span>
                                                  </div>
                                                );
                                              }
                                              if (l.match(/^\d+\./)) {
                                                return (
                                                  <div key={li} className="flex gap-2 ml-1 mb-1">
                                                    <span className="text-[#DC2626] font-semibold flex-shrink-0">{l.split(".")[0]}.</span>
                                                    <span>{l.slice(l.indexOf(".") + 2)}</span>
                                                  </div>
                                                );
                                              }
                                              return <p key={li} className="mb-1">{l}</p>;
                                            })}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Sources */}
                                    <div className="border-t border-[#E2E8F0] pt-3 mt-3">
                                      <h4 className="text-[#0F172A] font-bold text-xs uppercase tracking-wide mb-2">Official Sources</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {article.sources.map((source) => (
                                          <a
                                            key={source.url}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg hover:border-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                                          >
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {source.label}
                                          </a>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Ask AI link */}
                                    <div className="border-t border-[#E2E8F0] pt-3">
                                      <Link
                                        href={`/chat?q=${encodeURIComponent(article.title)}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#DC2626] hover:text-[#B91C1C] transition-colors"
                                      >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Ask AI about this topic
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Legal Aid Resources */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-5"
        >
          <h2 className="text-[#0F172A] font-bold text-base mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Free Legal Aid Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { region: "\u{1F1FA}\u{1F1F8} United States", orgs: "UNHCR \u00B7 ILRC \u00B7 CLINIC \u00B7 Vera Institute" },
              { region: "\u{1F1EC}\u{1F1E7} United Kingdom", orgs: "Migrant Help \u00B7 Law Centres Network \u00B7 JCWI" },
              { region: "\u{1F1E8}\u{1F1E6} Canada", orgs: "Legal Aid Ontario \u00B7 IRCC Tools \u00B7 CARL" },
              { region: "\u{1F1E9}\u{1F1EA} Germany", orgs: "Pro Asyl \u00B7 AWO \u00B7 Caritas Migrationsdienst" },
              { region: "\u{1F1E6}\u{1F1FA} Australia", orgs: "RACS \u00B7 ASRC \u00B7 Legal Aid NSW" },
              { region: "\u{1F30D} Global", orgs: "UNHCR \u00B7 IOM \u00B7 Asylum Access \u00B7 IRC" },
            ].map((item) => (
              <div key={item.region} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex-1">
                  <p className="text-[#0F172A] font-semibold text-sm">{item.region}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{item.orgs}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#94A3B8] text-xs mt-3 leading-relaxed">
            These organizations provide free or low-cost immigration legal services. Verify current availability directly with each organization.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#0F172A] rounded-2xl p-6 text-center pb-6"
        >
          <p className="text-white font-black text-lg mb-1">Need personalized guidance?</p>
          <p className="text-[#94A3B8] text-sm mb-4 leading-relaxed">
            Our AI advisor covers all countries listed here. Describe your situation and get step-by-step guidance in your language.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] text-white font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Start Free Consultation
          </Link>
          <p className="text-[#475569] text-xs mt-3">Multilingual · No sign-up required · Not legal advice</p>
        </motion.div>

      </div>
    </div>
  );
}
