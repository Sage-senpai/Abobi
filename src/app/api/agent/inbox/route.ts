/**
 * GET  /api/agent/inbox?wallet=0x...           → returns the user's agent inbox
 * POST /api/agent/inbox  body: { walletAddress, ids?: string[], markAll?: boolean }
 *      Marks the listed items as read (or all of them when markAll=true).
 */

import { NextRequest, NextResponse } from "next/server";
import { downloadProfile, uploadProfile } from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import type { UserProfile } from "@/types/user";

export const maxDuration = 60;
export const runtime = "nodejs";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

async function loadProfile(wallet: string): Promise<{ profile: UserProfile | null; index: Awaited<ReturnType<typeof getStorageIndex>> }> {
  const index = await getStorageIndex(wallet);
  let profile: UserProfile | null = null;
  if (index?.profileRootHash) {
    try {
      profile = await downloadProfile(index.profileRootHash);
    } catch {
      profile = null;
    }
  }
  return { profile, index };
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    const { profile } = await loadProfile(wallet);
    return NextResponse.json({
      inbox: profile?.agentInbox ?? [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load inbox";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { walletAddress?: string; ids?: string[]; markAll?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const wallet = body.walletAddress;
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    const { profile, index } = await loadProfile(wallet);
    if (!profile) return NextResponse.json({ error: "No profile yet" }, { status: 404 });

    const ids = new Set(body.ids ?? []);
    const updatedInbox = (profile.agentInbox ?? []).map((item) => {
      if (body.markAll || ids.has(item.id)) return { ...item, read: true };
      return item;
    });

    const merged: UserProfile = { ...profile, agentInbox: updatedInbox };
    const uploaded = await uploadProfile(merged);
    await upsertStorageIndex(wallet, index?.historyRootHash ?? "", uploaded.rootHash);

    return NextResponse.json({ ok: true, unread: updatedInbox.filter((i) => !i.read).length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update inbox";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
