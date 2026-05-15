"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage, ChatSource, ToolCallSummary, Attestation } from "@/types/chat";

/**
 * Renders the assistant's text body as Markdown.
 *
 * We deliberately do NOT pass the user's own bubble through Markdown — user
 * questions should appear verbatim. Component overrides target the chat-bubble
 * typography (slightly tighter line-height, list bullets, inline code) so the
 * result matches the surrounding bubble styling instead of falling back to
 * `prose` defaults that don't exist in this Tailwind v4 setup.
 */
function MarkdownBody({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-[#0F172A] [&_a]:text-[#DC2626] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-[#0F172A]">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children, ...props }) => {
            const isInline = !(props as { className?: string }).className?.includes("language-");
            if (isInline) {
              return (
                <code className="px-1 py-0.5 rounded bg-[#F1F5F9] text-[#0F172A] text-[12.5px] font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block px-3 py-2 rounded-lg bg-[#0F172A] text-[#F8FAFC] text-[12px] font-mono whitespace-pre-wrap">
                {children}
              </code>
            );
          },
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-0.5 marker:text-[#DC2626]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5 marker:text-[#DC2626]">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-1.5 text-[#0F172A]">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[15px] font-bold mt-3 mb-1.5 text-[#0F172A]">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[14px] font-bold mt-2.5 mb-1 text-[#0F172A]">{children}</h3>,
          h4: ({ children }) => <h4 className="text-[13.5px] font-semibold mt-2 mb-1 text-[#0F172A]">{children}</h4>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#DC2626] pl-3 my-2 text-[#475569] italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-[#E2E8F0]" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="text-[12px] border-collapse w-full">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-[#E2E8F0] px-2 py-1 bg-[#F8FAFC] font-bold text-left">{children}</th>
          ),
          td: ({ children }) => <td className="border border-[#E2E8F0] px-2 py-1 align-top">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

const TOOL_ICONS: Record<string, string> = {
  lookup_embassy: "\u{1F3DB}",
  find_service_provider: "\u{2696}",
  hire_provider: "\u{1F91D}",
  create_case: "\u{1F4C4}",
  extract_profile_facts: "\u{1F464}",
  schedule_reminder: "\u{23F0}",
  draft_document: "\u{270D}",
};

const TOOL_LABELS: Record<string, string> = {
  lookup_embassy: "Looking up embassy",
  find_service_provider: "Searching providers",
  hire_provider: "Hiring on chain",
  create_case: "Creating case",
  extract_profile_facts: "Saving profile facts",
  schedule_reminder: "Scheduling reminder",
  draft_document: "Drafting document",
};

function ToolCallsBlock({ calls }: { calls: ToolCallSummary[] }) {
  if (calls.length === 0) return null;
  return (
    <div className="mb-2 space-y-1.5">
      {calls.map((c, i) => {
        const icon = TOOL_ICONS[c.name] ?? "\u{1F527}";
        const label = TOOL_LABELS[c.name] ?? c.name;
        const isPending = c.uiSummary === "Working…";
        const isHire = c.name === "hire_provider" && c.ok && c.explorerUrl;

        if (isHire) {
          return (
            <div
              key={`${c.name}-${i}`}
              className="block p-3 rounded-xl border-2 border-[#DC2626] bg-gradient-to-br from-[#FEF2F2] to-white"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base leading-none">{icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                  Agent hire receipt
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  On chain
                </span>
              </div>
              <p className="text-[#0F172A] text-xs font-semibold mb-1.5">{c.uiSummary}</p>
              {c.txHash && (
                <p className="text-[10px] font-mono text-[#64748B] mb-2 break-all">
                  tx: {c.txHash}
                </p>
              )}
              <a
                href={c.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#DC2626] text-[11px] font-bold hover:underline"
              >
                View on 0G Scan
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );
        }

        return (
          <div
            key={`${c.name}-${i}`}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
              isPending
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : c.ok
                ? "bg-[#FEF2F2] border-[#FECACA] text-[#0F172A]"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <span className="text-sm leading-none">{icon}</span>
            <span className="font-bold">{label}</span>
            {isPending ? (
              <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-[10px] text-[#64748B]">· {c.uiSummary}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function shortHex(addr: string, head = 6, tail = 4): string {
  if (!addr.startsWith("0x") || addr.length <= head + tail + 2) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

function ProviderBadge({
  provider,
  attestation,
}: {
  provider: string;
  attestation?: Attestation;
}) {
  const [open, setOpen] = useState(false);
  const is0G =
    provider === "0g-compute-direct" ||
    provider === "0g-broker" ||
    provider.startsWith("0x");
  const isGroq = provider === "groq-fallback";

  if (isGroq) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
        Groq fallback
      </span>
    );
  }
  if (!is0G) return null;

  // Hex provider address: anchor explorer link
  const providerOnChain = attestation?.providerAddress?.startsWith("0x")
    ? attestation.providerAddress
    : provider.startsWith("0x")
    ? provider
    : null;

  const canExpand = !!(
    attestation &&
    (attestation.resKey || attestation.responseId || attestation.latencyMs || providerOnChain)
  );

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (canExpand) setOpen((v) => !v);
        }}
        disabled={!canExpand}
        className={`inline-flex items-center gap-1 text-[9px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-full px-1.5 py-0.5 ${
          canExpand ? "hover:bg-[#FECACA]/40 cursor-pointer" : "cursor-default"
        }`}
        title={canExpand ? "Verified by 0G Compute — click for receipt" : "0G Compute"}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
        Verified by 0G
        {canExpand && (
          <svg className="w-2.5 h-2.5 ml-0.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {open && attestation && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 mt-1 z-20 w-[280px] bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
                0G Compute receipt
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-[#94A3B8] hover:text-[#0F172A]"
                aria-label="Close"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="space-y-1.5 text-[10px]">
              {attestation.model && (
                <div>
                  <dt className="text-[#94A3B8] uppercase tracking-wider font-semibold">Model</dt>
                  <dd className="text-[#0F172A] font-mono">{attestation.model}</dd>
                </div>
              )}
              {providerOnChain && (
                <div>
                  <dt className="text-[#94A3B8] uppercase tracking-wider font-semibold">Provider wallet</dt>
                  <dd>
                    <a
                      href={`https://chainscan.0g.ai/address/${providerOnChain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DC2626] font-mono hover:underline"
                    >
                      {shortHex(providerOnChain, 10, 8)}
                    </a>
                  </dd>
                </div>
              )}
              {attestation.resKey && (
                <div>
                  <dt className="text-[#94A3B8] uppercase tracking-wider font-semibold">ZG-Res-Key</dt>
                  <dd className="text-[#0F172A] font-mono break-all">{attestation.resKey}</dd>
                </div>
              )}
              {attestation.responseId && (
                <div>
                  <dt className="text-[#94A3B8] uppercase tracking-wider font-semibold">Response ID</dt>
                  <dd className="text-[#0F172A] font-mono break-all">{attestation.responseId}</dd>
                </div>
              )}
              {typeof attestation.latencyMs === "number" && (
                <div>
                  <dt className="text-[#94A3B8] uppercase tracking-wider font-semibold">Inference latency</dt>
                  <dd className="text-[#0F172A] font-mono">{attestation.latencyMs} ms</dd>
                </div>
              )}
            </dl>
            <p className="mt-2 pt-2 border-t border-[#F1F5F9] text-[9px] text-[#64748B] leading-relaxed">
              Response served by a 0G Compute provider running inside a TEE.
              The Res-Key + provider wallet anchor this reply to a verifiable
              on-chain settlement receipt.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function SourcesBlock({ sources }: { sources: ChatSource[] }) {
  // De-duplicate by URL
  const seen = new Set<string>();
  const unique = sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
  if (unique.length === 0) return null;

  return (
    <div className="mt-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
      <p className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] mb-1.5">
        Sources from ZeroViza guides
      </p>
      <div className="space-y-1">
        {unique.map((s) => (
          <a
            key={`${s.citation}-${s.url}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-1.5 text-[11px] text-[#0F172A] hover:text-[#DC2626] transition-colors"
          >
            <span className="inline-flex w-4 h-4 rounded bg-[#DC2626]/10 text-[#DC2626] text-[9px] font-bold items-center justify-center flex-shrink-0 mt-0.5">
              {s.citation}
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-semibold">{s.flag} {s.country}</span>
              <span className="text-[#64748B]"> · {s.label}</span>
            </span>
            <svg className="w-3 h-3 text-[#94A3B8] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

export function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.25) }}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm shadow-red-200">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className="flex flex-col max-w-[78%]">
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallsBlock calls={message.toolCalls} />
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-[#0F172A] text-white rounded-br-sm shadow-sm"
              : "bg-white text-[#0F172A] border border-[#E2E8F0] rounded-bl-sm shadow-sm"
          }`}
        >
          {message.content && (
            isUser
              ? <p className="whitespace-pre-wrap">{message.content}</p>
              : <MarkdownBody>{message.content}</MarkdownBody>
          )}
          {!message.content && !isUser && (
            <p className="text-[#94A3B8] text-xs italic">Agent is working…</p>
          )}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesBlock sources={message.sources} />
        )}
        <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
          {!isUser && message.provider && (
            <ProviderBadge provider={message.provider} attestation={message.attestation} />
          )}
          <p className="text-[10px] text-[#94A3B8]">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
