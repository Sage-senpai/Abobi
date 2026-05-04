"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import { nanoid } from "nanoid";
import { useChatStore } from "@/store/chatStore";
import type { ChatMessage } from "@/types/chat";

interface SSEEvent {
  type: "start" | "chunk" | "done" | "error";
  content?: string;
  message?: ChatMessage;
  assistantId?: string;
  userMessageId?: string;
  error?: string;
}

async function* readSSE(response: Response): AsyncGenerator<SSEEvent, void, unknown> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload) continue;
        try {
          yield JSON.parse(payload) as SSEEvent;
        } catch {
          // skip malformed
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function useChat() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const {
    messages,
    isLoading,
    error,
    addMessage,
    updateMessage,
    appendToMessage,
    setLoading,
    setError,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!address || !content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Optimistic user bubble
      addMessage(userMsg);

      // Placeholder assistant bubble — fills in as tokens stream
      const assistantMsg: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content.trim(), walletAddress: address }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(errData.error ?? "Chat request failed");
        }

        let received = "";

        for await (const ev of readSSE(res)) {
          if (ev.type === "chunk" && ev.content) {
            received += ev.content;
            appendToMessage(assistantMsg.id, ev.content);
          } else if (ev.type === "done" && ev.message) {
            updateMessage(assistantMsg.id, {
              id: ev.message.id,
              content: ev.message.content,
              provider: ev.message.provider,
              timestamp: ev.message.timestamp,
            });
          } else if (ev.type === "error") {
            throw new Error(ev.error ?? "Stream error");
          }
        }

        if (!received) {
          throw new Error("No response received");
        }

        await queryClient.invalidateQueries({ queryKey: ["history", address] });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["profile", address] });
        }, 15_000);
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["profile", address] });
        }, 35_000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        updateMessage(assistantMsg.id, {
          content: `Sorry, something went wrong: ${msg}. Please try again.`,
        });
      } finally {
        setLoading(false);
      }
    },
    [address, isLoading, addMessage, updateMessage, appendToMessage, setLoading, setError, queryClient]
  );

  return { messages, isLoading, error, sendMessage };
}
