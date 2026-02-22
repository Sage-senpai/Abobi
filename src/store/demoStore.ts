"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// A fixed address used in demo mode — consistent across sessions so
// the demo user gets the same history and profile each time.
export const DEMO_WALLET_ADDRESS =
  "0x0000000000000000000000000000000000001337" as const;

interface DemoState {
  isDemoMode: boolean;
  enableDemo: () => void;
  disableDemo: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      enableDemo: () => set({ isDemoMode: true }),
      disableDemo: () => set({ isDemoMode: false }),
    }),
    { name: "abobi-demo" }
  )
);
