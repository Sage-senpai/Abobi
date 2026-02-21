"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { LoadingDots } from "@/components/ui/LoadingDots";

interface WalletGuardProps {
  children: React.ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { status } = useAccount();
  const router = useRouter();
  // mounted prevents redirect during the brief window between
  // ClientProviders mounting and wagmi completing its reconnection check.
  const [mounted, setMounted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "disconnected") {
      router.replace("/connect");
    }
  }, [mounted, status, router]);

  useEffect(() => {
    if (!mounted || (status !== "connecting" && status !== "reconnecting")) {
      setTimedOut(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimedOut(true);
      router.replace("/connect");
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [mounted, status, router]);

  // Show spinner until mounted + not in a transitional state
  if (!mounted || ((status === "connecting" || status === "reconnecting") && !timedOut)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <LoadingDots size="md" />
          <span className="text-sm">
            {status === "reconnecting" ? "Restoring wallet session..." : "Connecting wallet..."}
          </span>
        </div>
      </div>
    );
  }

  // Redirect in progress — render nothing
  if (status === "disconnected") {
    return null;
  }

  return <>{children}</>;
}
