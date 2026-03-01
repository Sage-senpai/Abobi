/**
 * POST /api/lawyers/verify
 * Admin-only: approve or reject a lawyer application.
 * Requires header: X-Admin-Secret: <ADMIN_SECRET env var>
 *
 * Body: { id: string, action: "approve" | "reject", reason?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyLawyer, rejectLawyer, getLawyerById } from "@/lib/db/client";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string; action: "approve" | "reject"; reason?: string };
  try {
    body = await req.json() as { id: string; action: "approve" | "reject"; reason?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action, reason } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
  }
  if (action === "reject" && !reason?.trim()) {
    return NextResponse.json({ error: "rejection reason is required" }, { status: 400 });
  }

  const lawyer = getLawyerById(id);
  if (!lawyer) {
    return NextResponse.json({ error: "Lawyer application not found" }, { status: 404 });
  }

  const ok = action === "approve"
    ? verifyLawyer(id)
    : rejectLawyer(id, reason!.trim());

  if (!ok) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, action, id });
}
