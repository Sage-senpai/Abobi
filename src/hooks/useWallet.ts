"use client";

import { useAccount } from "wagmi";
import { useDemoStore, DEMO_WALLET_ADDRESS } from "@/store/demoStore";

/**
 * Drop-in replacement for `useAccount` that also supports demo mode.
 * In demo mode, returns a fixed address with status "connected"
 * so the full app works without a real wallet installed.
 */
export function useWallet() {
  const { address: wagmiAddress, status: wagmiStatus } = useAccount();
  const isDemoMode = useDemoStore((s) => s.isDemoMode);

  if (isDemoMode) {
    return {
      address: DEMO_WALLET_ADDRESS as `0x${string}`,
      status: "connected" as const,
      isDemo: true,
    };
  }

  return {
    address: wagmiAddress,
    status: wagmiStatus,
    isDemo: false,
  };
}
