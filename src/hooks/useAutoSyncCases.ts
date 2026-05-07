"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useCaseStore } from "@/store/caseStore";
import type { VisaCase } from "@/types/case";

export type SyncState = "idle" | "pulling" | "syncing" | "synced" | "error";

const PUSH_DEBOUNCE_MS = 2_500;

function caseFingerprint(cases: VisaCase[]): string {
  // Cheap structural hash. Identifies status/note/timeline changes, ignores volatile fields.
  return cases
    .map((c) => `${c.id}:${c.status}:${c.updatedAt}:${c.events.length}`)
    .sort()
    .join("|");
}

interface AutoSyncOptions {
  /** Skip pulling from 0G on mount (defaults to false). */
  disableInitialPull?: boolean;
}

/**
 * Two-way sync between the local case store and the user's 0G profile blob.
 *
 *   1. On wallet connect, pulls /api/cases once and merges remote cases that
 *      aren't in the local store (by id). Local-only cases are preserved.
 *   2. Every local mutation triggers a debounced POST to /api/cases that
 *      overwrites the on-chain cases array. Updates lastSyncedAt + state.
 *
 * Returns the current sync state for UI surfaces.
 */
export function useAutoSyncCases(options: AutoSyncOptions = {}): SyncState {
  const { address, isDemo } = useWallet();
  const cases = useCaseStore((s) => s.cases);
  const replaceCases = useCaseStore((s) => s.replaceCases);
  const setLastSyncedAt = useCaseStore((s) => s.setLastSyncedAt);

  const [state, setState] = useState<SyncState>("idle");
  const initialPullDoneFor = useRef<string | null>(null);
  const lastPushedFingerprint = useRef<string | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initial pull: merge remote cases into the store on wallet connect ─────
  useEffect(() => {
    if (!address || isDemo) return;
    if (options.disableInitialPull) return;
    if (initialPullDoneFor.current === address) return;
    initialPullDoneFor.current = address;

    let cancelled = false;
    setState("pulling");
    (async () => {
      try {
        const res = await fetch(`/api/cases?wallet=${address}`);
        if (!res.ok) throw new Error("pull failed");
        const data = (await res.json()) as { cases: VisaCase[] };
        if (cancelled) return;

        if (data.cases.length > 0) {
          // Merge: keep local cases that aren't on chain (newly created
          // offline), and pull in any remote cases not yet local.
          const localById = new Map(cases.map((c) => [c.id, c]));
          const remoteIds = new Set(data.cases.map((c) => c.id));
          const merged: VisaCase[] = [
            ...data.cases.map((rc) => localById.get(rc.id) ?? rc),
            ...cases.filter((lc) => !remoteIds.has(lc.id)),
          ];
          replaceCases(merged);
          // Seed fingerprint so we don't immediately re-push the merge result.
          lastPushedFingerprint.current = caseFingerprint(merged);
        } else {
          // No remote cases yet — set fingerprint to current local so a push
          // only fires if user actually mutates.
          lastPushedFingerprint.current = caseFingerprint(cases);
        }
        setState("synced");
        setLastSyncedAt(Date.now());
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // We only want this to run once per wallet — `cases` intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isDemo, options.disableInitialPull]);

  // ── Debounced push on every local mutation ────────────────────────────────
  useEffect(() => {
    if (!address || isDemo) return;
    if (initialPullDoneFor.current !== address) return;

    const fingerprint = caseFingerprint(cases);
    if (fingerprint === lastPushedFingerprint.current) return;

    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      setState("syncing");
      try {
        const res = await fetch("/api/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address, cases }),
        });
        if (!res.ok) throw new Error("push failed");
        lastPushedFingerprint.current = fingerprint;
        setLastSyncedAt(Date.now());
        setState("synced");
      } catch {
        setState("error");
      }
    }, PUSH_DEBOUNCE_MS);

    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [cases, address, isDemo, setLastSyncedAt]);

  return state;
}
