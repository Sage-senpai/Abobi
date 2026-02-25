"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { ChatThread } from "@/components/chat/ChatThread";
import { ChatInput } from "@/components/chat/ChatInput";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { useChatStore } from "@/store/chatStore";
import { useChat } from "@/hooks/useChat";
import type { ChatMessage } from "@/types/chat";

async function loadHistory(wallet: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/history?wallet=${wallet}&limit=50`);
  if (!res.ok) return [];
  const data = (await res.json()) as { messages: ChatMessage[] };
  return data.messages;
}

export default function ChatPage() {
  const { address } = useWallet();
  const { messages, isLoading, sendMessage } = useChat();
  const setMessages = useChatStore((s) => s.setMessages);

  const { data: history } = useQuery({
    queryKey: ["history", address],
    queryFn: () => loadHistory(address!),
    enabled: !!address,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (history && messages.length === 0) {
      setMessages(history);
    }
  }, [history, messages.length, setMessages]);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[#0F172A] font-bold text-sm">AI Immigration Advisor</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[#64748B] text-xs">Online · 0G Compute · Not legal advice</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/resources"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] text-xs font-medium hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
            title="View immigration guides and checklists"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Guides
          </Link>
          <ConnectButton />
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <ChatThread messages={messages} isLoading={isLoading} />

      {/* ── Input ──────────────────────────────────────────────────────── */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!address}
      />
    </div>
  );
}
