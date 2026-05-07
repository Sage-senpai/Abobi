/**
 * Agent run endpoint.
 *
 *   POST /api/agent/run
 *     body: { walletAddress }
 *     auth: any (per-user manual run, called from the dashboard inbox tile)
 *
 *   GET  /api/agent/run?wallet=0x...
 *     auth: Authorization: Bearer <CRON_SECRET>
 *     for Vercel cron — runs the morning routine for one wallet
 *
 * The route runs the morning routine: analyzes open cases, generates a
 * one-line action summary via 0G Compute, appends inbox items, and
 * re-uploads the profile to 0G Storage with the new agentInbox state.
 */

import { NextRequest, NextResponse } from "next/server";
import { runMorningRoutine } from "@/lib/agent/morningRoutine";

export const maxDuration = 60;
export const runtime = "nodejs";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;
const CRON_SECRET = process.env.CRON_SECRET ?? "";

function isCronAuthorized(req: NextRequest): boolean {
  if (!CRON_SECRET) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${CRON_SECRET}`;
}

export async function POST(req: NextRequest) {
  let body: { walletAddress?: string };
  try {
    body = (await req.json()) as { walletAddress?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const wallet = body.walletAddress;
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    const result = await runMorningRoutine(wallet);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Agent run failed";
    console.error("[/api/agent/run]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    const result = await runMorningRoutine(wallet);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Agent run failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
