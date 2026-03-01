/**
 * GET /api/lawyers/status?wallet=0x...
 * Returns the current application status for a given wallet address.
 */

import { NextRequest, NextResponse } from "next/server";
import { getLawyerByWallet } from "@/lib/db/client";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const lawyer = getLawyerByWallet(wallet);
  if (!lawyer) {
    return NextResponse.json({ status: null });
  }

  return NextResponse.json({
    status: lawyer.status,
    id: lawyer.id,
    fullName: lawyer.fullName,
    rejectionReason: lawyer.rejectionReason,
    verifiedAt: lawyer.verifiedAt,
  });
}
