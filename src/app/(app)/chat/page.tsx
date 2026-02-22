"use client";

import { useEffect } from "react";
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

  // Load persisted history on mount
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
    <div className="flex flex-col h-screen lg:h-[calc(100vh-2rem)] lg:rounded-3xl lg:glass overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-abobi-purple to-abobi-glow flex items-center justify-center font-bold text-white glow-sm">
            A
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Abobi</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-abobi-muted text-xs">Online · 0G Compute</span>
            </div>
          </div>
        </div>
        <ConnectButton />
      </div>

      {/* Messages */}
      <ChatThread messages={messages} isLoading={isLoading} />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!address}
      />
    </div>
  );
}
