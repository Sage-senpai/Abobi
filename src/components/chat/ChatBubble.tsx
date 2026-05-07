"use client";

import { motion } from "framer-motion";
import type { ChatMessage, ChatSource, ToolCallSummary } from "@/types/chat";

const TOOL_ICONS: Record<string, string> = {
  lookup_embassy: "\u{1F3DB}",
  find_service_provider: "\u{2696}",
  create_case: "\u{1F4C4}",
  extract_profile_facts: "\u{1F464}",
  schedule_reminder: "\u{23F0}",
  draft_document: "\u{270D}",
};

const TOOL_LABELS: Record<string, string> = {
  lookup_embassy: "Looking up embassy",
  find_service_provider: "Searching providers",
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

function ProviderBadge({ provider }: { provider: string }) {
  const is0G =
    provider === "0g-compute-direct" ||
    provider === "0g-broker" ||
    provider.startsWith("0x");
  const isGroq = provider === "groq-fallback";

  if (is0G) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-full px-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
        0G Compute
      </span>
    );
  }
  if (isGroq) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-full px-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
        Groq
      </span>
    );
  }
  return null;
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
          {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
          {!message.content && !isUser && (
            <p className="text-[#94A3B8] text-xs italic">Agent is working…</p>
          )}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesBlock sources={message.sources} />
        )}
        <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
          {!isUser && message.provider && (
            <ProviderBadge provider={message.provider} />
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
