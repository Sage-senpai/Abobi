"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage } from "@/types/chat";

export interface ChatSession {
  id: string;
  walletAddress: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

interface SessionsState {
  sessions: ChatSession[];
  saveSession: (walletAddress: string, messages: ChatMessage[]) => string | null;
  deleteSession: (id: string) => void;
  getSession: (id: string) => ChatSession | undefined;
  forWallet: (walletAddress: string) => ChatSession[];
}

function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";
  const t = firstUser.content.trim().replace(/\s+/g, " ");
  return t.length > 60 ? `${t.slice(0, 60)}…` : t;
}

export const useChatSessionsStore = create<SessionsState>()(
  persist(
    (set, get) => ({
      sessions: [],

      saveSession: (walletAddress, messages) => {
        if (!walletAddress || messages.length === 0) return null;
        const id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        const now = Date.now();
        const session: ChatSession = {
          id,
          walletAddress: walletAddress.toLowerCase(),
          title: deriveTitle(messages),
          createdAt: now,
          updatedAt: now,
          messages,
        };
        set((state) => ({ sessions: [session, ...state.sessions].slice(0, 50) }));
        return id;
      },

      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      getSession: (id) => get().sessions.find((s) => s.id === id),

      forWallet: (walletAddress) => {
        const w = walletAddress.toLowerCase();
        return get()
          .sessions.filter((s) => s.walletAddress === w)
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
    }),
    {
      name: "zeroviza-chat-sessions",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
