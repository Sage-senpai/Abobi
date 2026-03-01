/**
 * POST /api/lawyers/apply
 * Body: LawyerApplication JSON
 * Submits (or re-submits) a lawyer verification application.
 */

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { upsertLawyerApplication, getLawyerByWallet } from "@/lib/db/client";
import type { LawyerApplication } from "@/types/lawyer";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export async function POST(req: NextRequest) {
  let body: LawyerApplication;
  try {
    body = (await req.json()) as LawyerApplication;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { walletAddress, fullName, email, barNumber, jurisdiction, specializations, yearsExperience, languages, bio, website } = body;

  if (!walletAddress || !WALLET_RE.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }
  if (!fullName?.trim()) return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  if (!email?.includes("@")) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  if (!barNumber?.trim()) return NextResponse.json({ error: "Bar number is required" }, { status: 400 });
  if (!jurisdiction?.trim()) return NextResponse.json({ error: "Jurisdiction is required" }, { status: 400 });
  if (!Array.isArray(specializations) || specializations.length === 0) {
    return NextResponse.json({ error: "At least one specialization is required" }, { status: 400 });
  }
  if (typeof yearsExperience !== "number" || yearsExperience < 0) {
    return NextResponse.json({ error: "Valid years of experience is required" }, { status: 400 });
  }
  if (!Array.isArray(languages) || languages.length === 0) {
    return NextResponse.json({ error: "At least one language is required" }, { status: 400 });
  }
  if (!bio?.trim()) return NextResponse.json({ error: "Bio is required" }, { status: 400 });

  // Check if already verified — don't allow re-application
  const existing = getLawyerByWallet(walletAddress);
  if (existing?.status === "verified") {
    return NextResponse.json({ error: "This wallet is already a verified lawyer" }, { status: 409 });
  }

  const id = existing?.id ?? nanoid();
  upsertLawyerApplication({
    id,
    walletAddress,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    barNumber: barNumber.trim(),
    jurisdiction: jurisdiction.trim(),
    specializations,
    yearsExperience,
    languages,
    bio: bio.trim(),
    website: website?.trim() ?? "",
  });

  return NextResponse.json({ success: true, id });
}
