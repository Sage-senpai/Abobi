"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import Link from "next/link";
import type { UserDocument } from "@/types/storage";

const DOC_CATEGORIES = [
  {
    label: "Identity Documents",
    icon: "🪪",
    examples: ["Passport", "National ID", "Birth Certificate"],
    tooltip: "Core identity documents required for almost every immigration application",
  },
  {
    label: "Financial Records",
    icon: "💰",
    examples: ["Bank Statements", "Tax Returns", "Pay Stubs"],
    tooltip: "Proof of financial stability required by most destination countries",
  },
  {
    label: "Legal Documents",
    icon: "⚖️",
    examples: ["Police Clearance", "Court Records", "Affidavits"],
    tooltip: "Background checks and legal records required for visa applications",
  },
  {
    label: "Education & Work",
    icon: "🎓",
    examples: ["Degree Certificates", "Employment Letters", "Transcripts"],
    tooltip: "Qualifications and work history documentation",
  },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMimeIcon(mimeType: string): string {
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.includes("word")) return "📝";
  return "📎";
}

async function fetchDocuments(wallet: string): Promise<UserDocument[]> {
  const res = await fetch(`/api/documents?wallet=${wallet}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { documents: UserDocument[] };
  return data.documents;
}

async function uploadDocument(wallet: string, file: File): Promise<UserDocument> {
  const form = new FormData();
  form.append("wallet", wallet);
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) {
    const err = (await res.json()) as { error?: string };
    throw new Error(err.error ?? "Upload failed");
  }
  const data = (await res.json()) as { document: UserDocument };
  return data.document;
}

async function removeDocument(id: string, wallet: string): Promise<void> {
  const res = await fetch(`/api/documents?id=${id}&wallet=${wallet}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

export default function DocumentsPage() {
  const { address, isDemo } = useWallet();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Only real wallets can upload (not demo mode — demo has no private key context)
  const isConnected = !!address && !isDemo;

  const { data: docs = [], isLoading: docsLoading } = useQuery({
    queryKey: ["documents", address],
    queryFn: () => fetchDocuments(address!),
    enabled: isConnected,
    staleTime: 30_000,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(address!, file),
    onSuccess: () => {
      setUploadError(null);
      queryClient.invalidateQueries({ queryKey: ["documents", address] });
    },
    onError: (err: Error) => {
      setUploadError(err.message);
    },
  });

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0 || !isConnected) return;
      setUploadError(null);
      Array.from(files).forEach((file) => uploadMutation.mutate(file));
    },
    [isConnected, uploadMutation]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (doc: UserDocument) => {
    if (!isConnected) return;
    setDeletingId(doc.id);
    try {
      await removeDocument(doc.id, address!);
      queryClient.invalidateQueries({ queryKey: ["documents", address] });
    } finally {
      setDeletingId(null);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.header
        className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-[#0F172A] font-black text-xl">Document Vault</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            Tamper-proof storage via 0G blockchain
          </p>
        </div>
        <ConnectButton />
      </motion.header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">

        {/* 0G storage explainer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F172A] rounded-2xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-base">0G Decentralized Storage</h2>
                <span className="text-[10px] font-bold text-green-400 bg-green-900/30 border border-green-800 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Your documents are stored on the 0G decentralized network. Each file gets a unique blockchain hash — lawyers and authorities can verify authenticity without accessing your private data.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: "Tamper-Proof", sub: "Blockchain hash" },
                  { label: "Verifiable", sub: "By lawyers" },
                  { label: "Permanent", sub: "Decentralized" },
                ].map((f) => (
                  <div key={f.label} className="bg-[#1E293B] rounded-lg p-2 text-center">
                    <p className="text-[#DC2626] text-[10px] font-bold uppercase tracking-wide">{f.label}</p>
                    <p className="text-[#64748B] text-[10px] mt-0.5">{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-[#0F172A] font-bold text-base mb-3">Upload Documents</h2>

          {!isConnected && (
            <div className="bg-[#FFFBEB] border border-amber-200 rounded-2xl p-5 text-center mb-3">
              <p className="text-amber-800 font-semibold text-sm mb-1">Wallet required for uploads</p>
              <p className="text-amber-700 text-xs mb-3">
                {isDemo
                  ? "Demo mode doesn't support 0G uploads. Connect a real wallet."
                  : "Connect your wallet to securely upload documents to the 0G blockchain."}
              </p>
              <ConnectButton />
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => isConnected && !isUploading && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200
              ${isDragging ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E2E8F0] bg-white hover:border-[#DC2626]/50 hover:bg-[#FEF2F2]/30"}
              ${isConnected && !isUploading ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={!isConnected || isUploading}
            />

            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-12 h-12 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-[#0F172A] font-semibold">Uploading to 0G blockchain...</p>
                  <p className="text-[#64748B] text-sm mt-1">Generating tamper-proof hash...</p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-[#0F172A] font-bold text-base mb-1">
                    {isDragging ? "Drop to upload" : "Drag & drop your documents"}
                  </p>
                  <p className="text-[#64748B] text-sm">
                    Passports, IDs, certificates, letters — PDF, JPG, PNG, DOCX up to 25MB
                  </p>
                  {isConnected && (
                    <span className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] text-white text-sm font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Browse Files
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload error */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-[#DC2626] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M12 16h.01" />
                </svg>
                <p className="text-[#DC2626] text-sm">{uploadError}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Document categories */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-[#0F172A] font-bold text-base mb-3">What to Upload</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOC_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-4 hover:border-[#DC2626]/40 transition-colors"
                title={cat.tooltip}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{cat.icon}</span>
                  <p className="text-[#0F172A] font-semibold text-sm">{cat.label}</p>
                  <button
                    onMouseEnter={() => setTooltipId(cat.label)}
                    onMouseLeave={() => setTooltipId(null)}
                    className="ml-auto text-[#94A3B8] hover:text-[#64748B]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
                    </svg>
                  </button>
                </div>
                <AnimatePresence>
                  {tooltipId === cat.label && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[#64748B] text-xs mb-2 leading-relaxed overflow-hidden"
                    >
                      {cat.tooltip}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex flex-wrap gap-1.5">
                  {cat.examples.map((ex) => (
                    <span key={ex} className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
                      {ex}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Uploaded docs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#0F172A] font-bold text-base">Your Vault</h2>
            {docs.length > 0 && (
              <span className="text-[#64748B] text-xs">
                {docs.length} document{docs.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!isConnected ? (
            <div className="bg-white border border-dashed border-[#E2E8F0] rounded-2xl p-10 text-center">
              <p className="text-[#64748B] text-sm">Connect a wallet to view your stored documents.</p>
            </div>
          ) : docsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : docs.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E2E8F0] rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[#0F172A] font-semibold mb-1">No documents yet</p>
              <p className="text-[#64748B] text-sm leading-relaxed max-w-xs mx-auto">
                Upload your first document above. It will be stored on 0G with a unique blockchain verification hash.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {docs.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center flex-shrink-0 text-base">
                      {getMimeIcon(doc.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F172A] font-semibold text-sm truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[#94A3B8] text-xs font-mono truncate max-w-[120px] sm:max-w-[200px]">
                          {doc.rootHash.slice(0, 10)}...{doc.rootHash.slice(-6)}
                        </p>
                        <span className="text-[#E2E8F0]">·</span>
                        <p className="text-[#94A3B8] text-xs flex-shrink-0">{formatSize(doc.size)}</p>
                      </div>
                    </div>
                    {doc.verified && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                        ✓ Verified
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(doc)}
                      disabled={deletingId === doc.id}
                      title="Remove from vault"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors flex-shrink-0 disabled:opacity-40"
                    >
                      {deletingId === doc.id ? (
                        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pb-4"
        >
          <Link
            href="/chat"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#DC2626] text-white font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask AI advisor what documents you need
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
