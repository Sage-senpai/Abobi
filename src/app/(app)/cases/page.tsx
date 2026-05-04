"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCaseStore } from "@/store/caseStore";
import {
  CASE_STATUSES,
  CASE_STATUS_LABELS,
  type CaseStatus,
  type VisaCase,
} from "@/types/case";

const STATUS_COLORS: Record<CaseStatus, string> = {
  preparing: "bg-slate-100 text-slate-700 border-slate-300",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  "biometrics-scheduled": "bg-amber-50 text-amber-700 border-amber-200",
  "interview-scheduled": "bg-purple-50 text-purple-700 border-purple-200",
  "additional-info-requested": "bg-orange-50 text-orange-700 border-orange-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  appeal: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const COUNTRY_OPTIONS = [
  "United States", "Canada", "United Kingdom", "Germany", "France",
  "Australia", "New Zealand", "Netherlands", "Ireland", "Japan",
  "South Korea", "Singapore", "UAE", "Saudi Arabia", "South Africa",
  "Brazil", "Mexico", "India", "China", "Other",
];

function formatDate(ts: number | null | undefined): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 86_400_000);
}

function CaseCard({ visaCase, onSelect }: { visaCase: VisaCase; onSelect: () => void }) {
  const ageDays = daysSince(visaCase.createdAt);
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="text-left bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#DC2626] hover:shadow-md transition-all w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-[#0F172A] font-bold text-base truncate">{visaCase.visaType}</p>
          <p className="text-[#64748B] text-xs">{visaCase.country}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border flex-shrink-0 ${STATUS_COLORS[visaCase.status]}`}>
          {CASE_STATUS_LABELS[visaCase.status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>Filed {formatDate(visaCase.filedAt)}</span>
        <span>{ageDays}d open</span>
      </div>
      {visaCase.receiptNumber && (
        <p className="text-[10px] text-[#94A3B8] font-mono mt-2 truncate">
          Receipt: {visaCase.receiptNumber}
        </p>
      )}
    </motion.button>
  );
}

function CaseDetail({
  visaCase,
  onClose,
}: {
  visaCase: VisaCase;
  onClose: () => void;
}) {
  const { updateStatus, updateCase, deleteCase } = useCaseStore();
  const [newStatus, setNewStatus] = useState<CaseStatus>(visaCase.status);
  const [statusNote, setStatusNote] = useState("");
  const [notes, setNotes] = useState(visaCase.notes ?? "");

  function handleAddEvent() {
    if (newStatus === visaCase.status && !statusNote.trim()) return;
    updateStatus(visaCase.id, newStatus, statusNote.trim() || undefined);
    setStatusNote("");
  }

  function handleDelete() {
    if (confirm(`Delete this ${visaCase.country} ${visaCase.visaType} case? This cannot be undone.`)) {
      deleteCase(visaCase.id);
      onClose();
    }
  }

  function handleSaveNotes() {
    updateCase(visaCase.id, { notes });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0">
              <h2 className="text-[#0F172A] font-black text-lg">{visaCase.visaType}</h2>
              <p className="text-[#64748B] text-sm">{visaCase.country}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] flex-shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">Filed</p>
              <p className="text-sm text-[#0F172A] font-semibold">{formatDate(visaCase.filedAt)}</p>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">Open</p>
              <p className="text-sm text-[#0F172A] font-semibold">{daysSince(visaCase.createdAt)} days</p>
            </div>
          </div>

          {visaCase.receiptNumber && (
            <div className="mb-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">Receipt / Application Number</p>
              <p className="text-sm font-mono text-[#0F172A] break-all">{visaCase.receiptNumber}</p>
            </div>
          )}

          {/* Update status */}
          <div className="mb-5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
            <p className="text-[#0F172A] font-bold text-sm mb-2">Log a status update</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] mb-2 focus:border-[#DC2626] focus:outline-none"
            >
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>{CASE_STATUS_LABELS[s]}</option>
              ))}
            </select>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Optional note (e.g. interview at Lagos consulate Aug 14)"
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] mb-2 focus:border-[#DC2626] focus:outline-none"
            />
            <button
              onClick={handleAddEvent}
              className="w-full py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-colors"
            >
              Add update
            </button>
          </div>

          {/* Notes */}
          <div className="mb-5">
            <p className="text-[#0F172A] font-bold text-sm mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              rows={3}
              placeholder="Anything to remember about this case…"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none resize-none"
            />
          </div>

          {/* Timeline */}
          <div className="mb-5">
            <p className="text-[#0F172A] font-bold text-sm mb-3">Timeline ({visaCase.events.length})</p>
            <div className="space-y-2">
              {visaCase.events.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <div className="w-2 h-2 rounded-full bg-[#DC2626] mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[#0F172A] text-xs font-semibold">{CASE_STATUS_LABELS[ev.status]}</p>
                      <span className="text-[10px] text-[#94A3B8] flex-shrink-0">{formatDate(ev.timestamp)}</span>
                    </div>
                    {ev.note && <p className="text-[#64748B] text-xs">{ev.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="w-full py-2 border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete case
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateCaseModal({ onClose }: { onClose: () => void }) {
  const { createCase } = useCaseStore();
  const [country, setCountry] = useState("United States");
  const [visaType, setVisaType] = useState("");
  const [status, setStatus] = useState<CaseStatus>("preparing");
  const [filedDate, setFiledDate] = useState("");
  const [receipt, setReceipt] = useState("");

  function handleCreate() {
    if (!visaType.trim()) return;
    createCase({
      country,
      visaType: visaType.trim(),
      status,
      filedAt: filedDate ? new Date(filedDate).getTime() : null,
      receiptNumber: receipt.trim() || undefined,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-[#0F172A] font-black text-lg">New visa case</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[#0F172A] text-xs font-bold mb-1">Destination country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#0F172A] text-xs font-bold mb-1">Visa type *</label>
            <input
              type="text"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              placeholder="e.g. H-1B, Express Entry, Skilled Worker"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] text-xs font-bold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none"
            >
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>{CASE_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#0F172A] text-xs font-bold mb-1">Filed date (if applicable)</label>
            <input
              type="date"
              value={filedDate}
              onChange={(e) => setFiledDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] text-xs font-bold mb-1">Receipt / application number</label>
            <input
              type="text"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
              placeholder="e.g. EAC2412345678 (optional)"
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] font-mono focus:border-[#DC2626] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!visaType.trim()}
          className="w-full mt-5 py-2.5 bg-[#DC2626] text-white text-sm font-bold rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create case
        </button>
        <p className="text-[#94A3B8] text-[10px] text-center mt-2">
          Stored locally on your device. Cloud sync to 0G Storage coming soon.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function CasesPage() {
  const [hydrated, setHydrated] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | CaseStatus>("");
  const cases = useCaseStore((s) => s.cases);

  useEffect(() => setHydrated(true), []);

  const selected = useMemo(
    () => cases.find((c) => c.id === selectedId) ?? null,
    [cases, selectedId]
  );

  const filtered = useMemo(
    () => (statusFilter ? cases.filter((c) => c.status === statusFilter) : cases),
    [cases, statusFilter]
  );

  const summary = useMemo(() => {
    const counts: Partial<Record<CaseStatus, number>> = {};
    for (const c of cases) counts[c.status] = (counts[c.status] ?? 0) + 1;
    return {
      total: cases.length,
      active: cases.filter((c) => c.status !== "approved" && c.status !== "rejected").length,
      approved: counts.approved ?? 0,
    };
  }, [cases]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">My Visa Cases</h1>
            <p className="text-[#64748B] text-sm mt-1">
              Track every application, its status, and your timeline in one place
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New case
          </button>
        </div>

        {/* Summary */}
        {hydrated && cases.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Total</p>
              <p className="text-[#0F172A] font-black text-2xl mt-1">{summary.total}</p>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-4">
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Active</p>
              <p className="text-blue-700 font-black text-2xl mt-1">{summary.active}</p>
            </div>
            <div className="bg-white border border-green-200 rounded-xl p-4">
              <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Approved</p>
              <p className="text-green-700 font-black text-2xl mt-1">{summary.approved}</p>
            </div>
          </div>
        )}

        {/* Filter */}
        {hydrated && cases.length > 0 && (
          <div className="mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | CaseStatus)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:border-[#DC2626] focus:outline-none"
            >
              <option value="">All statuses ({cases.length})</option>
              {CASE_STATUSES.map((s) => (
                <option key={s} value={s}>{CASE_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        )}

        {/* List or empty state */}
        {!hydrated ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-[#0F172A] font-bold text-base mb-1">No cases tracked yet</p>
            <p className="text-[#64748B] text-sm mb-4">
              Add your first visa application to start tracking its progress and timeline.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors"
            >
              Create first case
            </button>
            <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
              <Link href="/chat" className="text-[#DC2626] text-xs font-semibold hover:underline">
                Not sure which visa? Ask the AI advisor →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <CaseCard key={c.id} visaCase={c} onSelect={() => setSelectedId(c.id)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateCaseModal onClose={() => setShowCreate(false)} />}
        {selected && <CaseDetail visaCase={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </div>
  );
}
