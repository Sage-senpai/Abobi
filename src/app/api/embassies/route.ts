/**
 * GET /api/embassies
 * Returns the embassy directory.
 *
 * Source priority:
 *   1. 0G Storage at NEXT_PUBLIC_EMBASSIES_ROOT_HASH (if set) — admin-uploaded snapshot
 *   2. Bundled seed at src/data/embassies.ts (fallback)
 *
 * The bundled seed always works offline; the 0G hash makes the directory
 * updatable without a code deploy. Admin uploads via /api/admin/embassies.
 */

import { NextResponse } from "next/server";
import { downloadFromStorage } from "@/lib/0g/storage";
import { EMBASSIES as SEED_EMBASSIES } from "@/data/embassies";
import type { Embassy } from "@/types/embassy";

export const runtime = "nodejs";
export const revalidate = 300; // re-fetch from 0G every 5 minutes

let cache: { rootHash: string | null; data: Embassy[]; expires: number } | null = null;

export async function GET() {
  const rootHash = process.env.NEXT_PUBLIC_EMBASSIES_ROOT_HASH ?? null;
  const now = Date.now();

  if (cache && cache.rootHash === rootHash && cache.expires > now) {
    return NextResponse.json({ embassies: cache.data, source: rootHash ? "0g" : "seed" });
  }

  if (rootHash) {
    try {
      const buf = await downloadFromStorage(rootHash);
      const parsed = JSON.parse(buf.toString("utf-8")) as Embassy[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        cache = { rootHash, data: parsed, expires: now + 5 * 60_000 };
        return NextResponse.json({ embassies: parsed, source: "0g", rootHash });
      }
    } catch (err) {
      console.warn("[/api/embassies] 0G download failed, using seed:", err);
    }
  }

  cache = { rootHash, data: SEED_EMBASSIES, expires: now + 5 * 60_000 };
  return NextResponse.json({ embassies: SEED_EMBASSIES, source: "seed" });
}
