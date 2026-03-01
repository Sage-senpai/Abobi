/**
 * GET  /api/lawyers             → list all verified lawyers
 * GET  /api/lawyers?all=1       → list all applications (admin only, requires X-Admin-Secret header)
 */

import { NextRequest, NextResponse } from "next/server";
import { getVerifiedLawyers, getAllLawyerApplications } from "@/lib/db/client";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");

  if (all === "1") {
    const secret = req.headers.get("x-admin-secret");
    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const lawyers = getAllLawyerApplications();
    return NextResponse.json({ lawyers });
  }

  const lawyers = getVerifiedLawyers();
  return NextResponse.json({ lawyers });
}
