"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import { nanoid } from "nanoid";
import { useChatStore } from "@/store/chatStore";
import { useCaseStore } from "@/store/caseStore";
import type { ChatMessage, ChatSource, ToolCallSummary, Attestation } from "@/types/chat";
import type { VisaCase } from "@/types/case";

interface SSEEvent {
  type:
    | "start"
    | "chunk"
    | "done"
    | "error"
    | "sources"
    | "tool_start"
    | "tool_done"
    | "tool_error"
    | "attestation";
  content?: string;
  message?: ChatMessage;
  assistantId?: string;
  userMessageId?: string;
  error?: string;
  sources?: ChatSource[];
  name?: string;
  id?: string;
  ok?: boolean;
  summary?: string;
  explorerUrl?: string;
  txHash?: string;
  attestation?: Attestation;
  newCases?: VisaCase[];
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
        const liveToolCalls: ToolCallSummary[] = [];

        for await (const ev of readSSE(res)) {
          if (ev.type === "chunk" && ev.content) {
            received += ev.content;
            appendToMessage(assistantMsg.id, ev.content);
          } else if (ev.type === "sources" && ev.sources) {
            updateMessage(assistantMsg.id, { sources: ev.sources });
          } else if (ev.type === "attestation" && ev.attestation) {
            updateMessage(assistantMsg.id, { attestation: ev.attestation });
          } else if (ev.type === "tool_start" && ev.name) {
            liveToolCalls.push({ name: ev.name, uiSummary: "Working…", ok: true });
            updateMessage(assistantMsg.id, { toolCalls: [...liveToolCalls] });
          } else if (ev.type === "tool_done" && ev.name) {
            const idx = liveToolCalls.findIndex((t) => t.name === ev.name && t.uiSummary === "Working…");
            const finalized = {
              name: ev.name,
              uiSummary: ev.summary ?? "Done",
              ok: !!ev.ok,
              explorerUrl: ev.explorerUrl,
              txHash: ev.txHash,
            };
            if (idx >= 0) liveToolCalls[idx] = finalized;
            else liveToolCalls.push(finalized);
            updateMessage(assistantMsg.id, { toolCalls: [...liveToolCalls] });
          } else if (ev.type === "tool_error" && ev.name) {
            liveToolCalls.push({ name: ev.name, uiSummary: ev.error ?? "Tool failed", ok: false });
            updateMessage(assistantMsg.id, { toolCalls: [...liveToolCalls] });
          } else if (ev.type === "done" && ev.message) {
            updateMessage(assistantMsg.id, {
              id: ev.message.id,
              content: ev.message.content,
              provider: ev.message.provider,
              timestamp: ev.message.timestamp,
              sources: ev.message.sources,
              toolCalls: ev.message.toolCalls ?? liveToolCalls,
            });
            // Hydrate the local case store with any cases the agent
            // created this turn so the dashboard + /cases page reflect
            // them immediately (without waiting for a full page refresh).
            if (ev.newCases?.length) {
              const store = useCaseStore.getState();
              const existingIds = new Set(store.cases.map((c) => c.id));
              const fresh = ev.newCases.filter((c) => !existingIds.has(c.id));
              if (fresh.length > 0) {
                store.replaceCases([...fresh, ...store.cases]);
                store.setLastSyncedAt(Date.now());
              }
            }
          } else if (ev.type === "error") {
            throw new Error(ev.error ?? "Stream error");
          }
        }

        if (!received && liveToolCalls.length === 0) {
          throw new Error("No response received");
        }

        await queryClient.invalidateQueries({ queryKey: ["history", address] });
        // Profile persist happens in the background AFTER the stream
        // closes, so wait a beat before invalidating — otherwise we'd
        // refetch the pre-persist profile and miss the new streak +
        // totals. Re-invalidate again later in case 0G upload was slow.
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["profile", address] });
        }, 4_000);
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["profile", address] });
        }, 20_000);
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
