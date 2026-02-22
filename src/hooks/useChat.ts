"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import { nanoid } from "nanoid";
import { useChatStore } from "@/store/chatStore";
import type { ChatMessage, ChatResponse } from "@/types/chat";

export function useChat() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const { messages, isLoading, error, addMessage, setLoading, setError } =
    useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!address || !content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Optimistic update
      addMessage(userMsg);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content.trim(), walletAddress: address }),
        });

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(errData.error ?? "Chat request failed");
        }

        const data = (await res.json()) as ChatResponse;
        addMessage(data.message);

        // Invalidate history and profile caches after successful chat
        await queryClient.invalidateQueries({ queryKey: ["history", address] });
        if (data.streakUpdated) {
          await queryClient.invalidateQueries({ queryKey: ["profile", address] });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        // Add a visible error message in the chat
        addMessage({
          id: nanoid(),
          role: "assistant",
          content: `Omo, e no work: ${msg}. Abeg try again!`,
          timestamp: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    },
    [address, isLoading, addMessage, setLoading, setError, queryClient]
  );

  return { messages, isLoading, error, sendMessage };
}
