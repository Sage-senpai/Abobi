"use client";

// `ssr: false` is only allowed in Client Components (Next.js 15 rule).
// This thin wrapper lives here so layout.tsx (a Server Component) can
// still export `metadata` / `viewport` while WalletConnect never runs on
// the server (it uses indexedDB which doesn't exist in Node.js).

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const Providers = dynamic(
  () => import("./providers").then((m) => ({ default: m.Providers })),
  { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
