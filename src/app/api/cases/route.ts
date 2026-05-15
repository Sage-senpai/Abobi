/**
 * GET  /api/cases?wallet=0x...   → cases stored in user's 0G profile
 * POST /api/cases                → overwrite cases array in 0G profile
 *
 * Body for POST: { walletAddress: string, cases: VisaCase[] }
 *
 * Cases are embedded inside the existing UserProfile blob to avoid a
 * StorageIndex contract redeploy. The profileRoot pointer on-chain is
 * updated atomically with each sync.
 */

import { NextRequest, NextResponse } from "next/server";
import { downloadProfile, uploadProfile } from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { createDefaultProfile } from "@/lib/zeroviza/streak";
import type { VisaCase } from "@/types/case";
import type { UserProfile } from "@/types/user";

export const maxDuration = 60;
export const runtime = "nodejs";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

async function loadProfile(wallet: string): Promise<{
  profile: UserProfile;
  index: Awaited<ReturnType<typeof getStorageIndex>>;
  /** True when an on-chain profileRootHash exists but the blob could not be fetched. */
  downloadFailed: boolean;
}> {
  const index = await getStorageIndex(wallet);
  let profile: UserProfile | null = null;
  let downloadFailed = false;
  if (index?.profileRootHash) {
    try {
      profile = await downloadProfile(index.profileRootHash);
    } catch (err) {
      console.warn("[/api/cases] profile download failed:", err);
      profile = null;
      downloadFailed = true;
    }
  }
  if (!profile) profile = createDefaultProfile(wallet);
  return { profile, index, downloadFailed };
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    const { profile } = await loadProfile(wallet);
    return NextResponse.json({ cases: profile.cases ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load cases";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    walletAddress?: string;
    cases?: VisaCase[];
  };

  const { walletAddress, cases } = body;
  if (!walletAddress || !WALLET_RE.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }
  if (!Array.isArray(cases)) {
    return NextResponse.json({ error: "cases must be an array" }, { status: 400 });
  }

  try {
    const { profile, index, downloadFailed } = await loadProfile(walletAddress);

    // Refuse to overwrite a profile we couldn't load — otherwise we'd
    // replace the user's real streak / createdAt / persona / inbox with
    // a fresh default just because 0G flaked once. Client should retry.
    if (downloadFailed) {
      return NextResponse.json(
        { error: "Profile temporarily unavailable on 0G — retry shortly" },
        { status: 503 }
      );
    }

    const updatedProfile: UserProfile = { ...profile, cases };

    const profileResult = await uploadProfile(updatedProfile);
    await upsertStorageIndex(
      walletAddress,
      index?.historyRootHash ?? "",
      profileResult.rootHash
    );

    return NextResponse.json({
      success: true,
      casesCount: cases.length,
      profileRootHash: profileResult.rootHash,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to sync cases";
    console.error("[/api/cases] POST", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
