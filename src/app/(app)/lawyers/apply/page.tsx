"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import type { LawyerApplication } from "@/types/lawyer";

const SPECIALIZATION_OPTIONS = [
  "Immigration",
  "Asylum",
  "Refugee Law",
  "Work Permits",
  "Family Reunification",
  "Deportation Defense",
  "Citizenship",
  "Student Visas",
  "Business Immigration",
  "Investor Visas",
  "Criminal Immigration",
  "Human Trafficking",
];

const LANGUAGE_OPTIONS = [
  "English", "Spanish", "French", "Arabic", "Portuguese",
  "Hausa", "Yoruba", "Igbo", "Swahili", "Hindi",
  "Bengali", "Tagalog", "Indonesian", "German", "Italian",
];

type ApplicationStatus = {
  status: "pending" | "verified" | "rejected" | null;
  fullName?: string;
  rejectionReason?: string | null;
};

async function fetchStatus(wallet: string): Promise<ApplicationStatus> {
  const res = await fetch(`/api/lawyers/status?wallet=${wallet}`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json() as Promise<ApplicationStatus>;
}

async function submitApplication(data: LawyerApplication): Promise<{ success: boolean; id: string }> {
  const res = await fetch("/api/lawyers/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json() as { success?: boolean; id?: string; error?: string };
  if (!res.ok) throw new Error(json.error ?? "Submission failed");
  return { success: true, id: json.id! };
}

export default function LawyerApplyPage() {
  const { address, isDemo } = useWallet();

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["lawyer-status", address],
    queryFn: () => fetchStatus(address!),
    enabled: !!address && !isDemo,
  });

  const [form, setForm] = useState<Omit<LawyerApplication, "walletAddress">>({
    fullName: "",
    email: "",
    barNumber: "",
    jurisdiction: "",
    specializations: [],
    yearsExperience: 0,
    languages: ["English"],
    bio: "",
    website: "",
  });

  const mutation = useMutation({
    mutationFn: submitApplication,
  });

  function toggleItem(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address || isDemo) return;
    mutation.mutate({ ...form, walletAddress: address });
  }

  // No wallet
  if (!address || isDemo) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Wallet Required</h2>
          <p className="text-[#64748B] text-sm mb-4">
            You need to connect a real wallet on 0G network to apply for lawyer verification.
          </p>
          <Link href="/connect" className="inline-flex px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors">
            Connect Wallet
          </Link>
        </div>
      </div>
    );
  }

  // Already verified
  if (statusData?.status === "verified") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Already Verified</h2>
          <p className="text-[#64748B] text-sm mb-4">
            {statusData.fullName ?? "You are"} already listed as a verified lawyer on Abobi Legal.
          </p>
          <Link href="/lawyers" className="inline-flex px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors">
            View Directory
          </Link>
        </div>
      </div>
    );
  }

  // Pending review
  if (statusData?.status === "pending") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Application Under Review</h2>
          <p className="text-[#64748B] text-sm mb-4">
            Your application is being reviewed. We will update your status within 2–3 business days.
          </p>
          <Link href="/lawyers" className="text-sm text-[#DC2626] hover:underline">
            View verified lawyers →
          </Link>
        </div>
      </div>
    );
  }

  // Submitted successfully
  if (mutation.isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Application Submitted</h2>
          <p className="text-[#64748B] text-sm mb-4">
            Thank you! Your application is now under review. We will verify your credentials and notify you within 2–3 business days.
          </p>
          <Link href="/lawyers" className="inline-flex px-4 py-2 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors">
            View Lawyer Directory
          </Link>
        </motion.div>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/lawyers" className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] mb-4 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to directory
          </Link>
          <h1 className="text-2xl font-black text-[#0F172A]">Apply for Verification</h1>
          <p className="text-[#64748B] text-sm mt-1">
            Submit your credentials to be listed as a verified immigration lawyer on Abobi Legal.
          </p>
        </div>

        {/* Rejection notice */}
        <AnimatePresence>
          {statusData?.status === "rejected" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-sm font-semibold text-red-700 mb-1">Previous application rejected</p>
              {statusData.rejectionReason && (
                <p className="text-sm text-red-600">{statusData.rejectionReason}</p>
              )}
              <p className="text-xs text-red-500 mt-1">You may re-apply with updated information below.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal info */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Personal Information</h2>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Full Legal Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Jane Adeyemi"
                className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Professional Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@lawfirm.com"
                className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Website / LinkedIn</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourfirm.com"
                className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          {/* Bar credentials */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Bar Credentials</h2>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Bar Number / License ID *</label>
              <input
                type="text"
                required
                value={form.barNumber}
                onChange={(e) => setForm({ ...form, barNumber: e.target.value })}
                placeholder="e.g. CA-12345 or SRA-987654"
                className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Jurisdiction *</label>
              <input
                type="text"
                required
                value={form.jurisdiction}
                onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
                placeholder="e.g. California, USA or England & Wales, UK"
                className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Years of Experience *</label>
              <input
                type="number"
                required
                min={0}
                max={60}
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: Number(e.target.value) })}
                className="w-32 px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">
              Specializations * <span className="text-[#DC2626]">({form.specializations.length} selected)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATION_OPTIONS.map((spec) => {
                const active = form.specializations.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setForm({ ...form, specializations: toggleItem(form.specializations, spec) })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? "bg-[#DC2626] text-white border-[#DC2626]"
                        : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#DC2626] hover:text-[#DC2626]"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">
              Languages * <span className="text-[#DC2626]">({form.languages.length} selected)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = form.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setForm({ ...form, languages: toggleItem(form.languages, lang) })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      active
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A] hover:text-[#0F172A]"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">Professional Bio *</h2>
            <textarea
              required
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Briefly describe your practice, experience with immigration cases, and how you can help Abobi Legal users…"
              className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC2626] transition-colors resize-none"
            />
            <p className="text-xs text-[#94A3B8] mt-1.5">{form.bio.length} / 1000 characters</p>
          </div>

          {/* Wallet address shown */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4">
            <p className="text-xs text-[#64748B] mb-1">Wallet address (your identity on 0G)</p>
            <p className="text-sm font-mono text-[#0F172A] break-all">{address}</p>
          </div>

          {/* Error */}
          {mutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {mutation.error instanceof Error ? mutation.error.message : "Submission failed. Please try again."}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              mutation.isPending ||
              form.specializations.length === 0 ||
              form.languages.length === 0
            }
            className="w-full py-3 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
