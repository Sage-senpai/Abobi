"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import type { AgentInboxItem } from "@/types/user";

interface InboxResponse {
  inbox: AgentInboxItem[];
}

interface RunResponse {
  walletAddress: string;
  ranAt: number;
  casesAnalyzed: number;
  inboxItemsAdded: number;
  summary: string | null;
  skipped?: string;
}

async function fetchInbox(wallet: string): Promise<InboxResponse> {
  const res = await fetch(`/api/agent/inbox?wallet=${wallet}`);
  if (!res.ok) throw new Error("Failed to load inbox");
  return res.json() as Promise<InboxResponse>;
}

async function runAgent(wallet: string): Promise<RunResponse> {
  const res = await fetch("/api/agent/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: wallet }),
  });
  const data = (await res.json()) as RunResponse & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Agent run failed");
  return data;
}

async function markAllRead(wallet: string): Promise<void> {
  await fetch("/api/agent/inbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: wallet, markAll: true }),
  });
}

const TYPE_STYLES: Record<AgentInboxItem["type"], { dot: string; border: string }> = {
  reminder: { dot: "bg-amber-500", border: "border-amber-200" },
  "case-update": { dot: "bg-blue-500", border: "border-blue-200" },
  "tool-result": { dot: "bg-purple-500", border: "border-purple-200" },
  system: { dot: "bg-[#DC2626]", border: "border-[#FECACA]" },
};

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function AgentInboxPanel() {
  const { address, isDemo } = useWallet();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["agent-inbox", address],
    queryFn: () => fetchInbox(address!),
    enabled: !!address && !isDemo,
    staleTime: 30_000,
  });

  const runMutation = useMutation({
    mutationFn: () => runAgent(address!),
    onSuccess: (result) => {
      setRunResult(result);
      queryClient.invalidateQueries({ queryKey: ["agent-inbox", address] });
    },
  });

  const markMutation = useMutation({
    mutationFn: () => markAllRead(address!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agent-inbox", address] }),
  });

  if (!address || isDemo) return null;

  const inbox = data?.inbox ?? [];
  const unread = inbox.filter((i) => !i.read).length;
  const visible = expanded ? inbox.slice(0, 10) : inbox.slice(0, 3);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] flex-shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-[#0F172A] font-bold text-sm flex items-center gap-2">
              Agent Inbox
              {unread > 0 && (
                <span className="bg-[#DC2626] text-white text-[10px] font-bold rounded-full px-2 py-0.5">{unread}</span>
              )}
            </p>
            <p className="text-[#64748B] text-xs">Daily action items from your agent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={() => markMutation.mutate()}
              disabled={markMutation.isPending}
              className="text-[#64748B] text-xs font-semibold hover:text-[#0F172A] transition-colors disabled:opacity-50"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] text-white text-xs font-semibold rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50"
          >
            {runMutation.isPending ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running…
              </>
            ) : (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run agent now
              </>
            )}
          </button>
        </div>
      </div>

      {runResult && (
        <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-[11px] text-green-800">
          {runResult.skipped
            ? `Agent: ${runResult.skipped}`
            : `Agent ran. Analyzed ${runResult.casesAnalyzed} case${runResult.casesAnalyzed === 1 ? "" : "s"}, added ${runResult.inboxItemsAdded} item${runResult.inboxItemsAdded === 1 ? "" : "s"}.`}
        </div>
      )}

      {runMutation.isError && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700">
          {runMutation.error instanceof Error ? runMutation.error.message : "Agent run failed"}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 py-4">
          <span className="w-4 h-4 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#64748B] text-xs">Loading inbox…</span>
        </div>
      ) : inbox.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[#64748B] text-xs leading-relaxed">
            Inbox is quiet. Your agent runs daily at 8am UTC and writes here when there is something to act on.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((item) => {
            const style = TYPE_STYLES[item.type];
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border ${style.border} ${
                  item.read ? "bg-[#F8FAFC] opacity-70" : "bg-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${style.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[#0F172A] text-xs font-bold truncate">{item.title}</p>
                    <span className="text-[10px] text-[#94A3B8] flex-shrink-0">{formatRelative(item.createdAt)}</span>
                  </div>
                  {item.detail && <p className="text-[#475569] text-[11px] leading-relaxed">{item.detail}</p>}
                </div>
              </div>
            );
          })}
          {inbox.length > 3 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full text-center text-[#DC2626] text-xs font-semibold hover:underline pt-1"
            >
              {expanded ? "Show less" : `Show ${Math.min(inbox.length - 3, 7)} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
