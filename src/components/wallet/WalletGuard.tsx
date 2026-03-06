"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useDemoStore } from "@/store/demoStore";

interface WalletGuardProps {
  children: React.ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { status } = useAccount();
  const isDemoMode = useDemoStore((s) => s.isDemoMode);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to /connect when wallet is disconnected
  useEffect(() => {
    if (isDemoMode) return;
    if (mounted && status === "disconnected") {
      router.replace("/connect");
    }
  }, [mounted, status, isDemoMode, router]);

  // Demo mode bypasses all wallet checks
  if (isDemoMode) return <>{children}</>;

  // Not yet mounted — render nothing to avoid hydration mismatch
  if (!mounted) return null;

  // Disconnected — redirect in progress
  if (status === "disconnected") return null;

  // Connected, reconnecting, or connecting — render children optimistically.
  // "reconnecting" means wagmi found a persisted session and is restoring it,
  // so we show the app immediately instead of a blocking spinner.
  // If reconnection ultimately fails, status becomes "disconnected" and the
  // useEffect above redirects to /connect.
  return <>{children}</>;
}
