/**
 * POST /api/admin/embassies
 * Uploads an embassy array to 0G Storage and returns the rootHash.
 *
 * Auth: header X-Admin-Secret must match ADMIN_SECRET env var.
 *
 * After uploading, set NEXT_PUBLIC_EMBASSIES_ROOT_HASH=<rootHash> in
 * environment to make GET /api/embassies serve the new snapshot.
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/0g/storage";
import type { Embassy } from "@/types/embassy";

export const maxDuration = 60;
export const runtime = "nodejs";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

function isValidEmbassy(e: unknown): e is Embassy {
  if (!e || typeof e !== "object") return false;
  const o = e as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.representingCountry === "string" &&
    typeof o.hostCountry === "string" &&
    typeof o.hostCity === "string" &&
    typeof o.address === "string" &&
    Array.isArray(o.servicesOffered)
  );
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { embassies?: Embassy[] };
  try {
    body = (await req.json()) as { embassies?: Embassy[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.embassies) || body.embassies.length === 0) {
    return NextResponse.json({ error: "embassies must be a non-empty array" }, { status: 400 });
  }

  const invalid = body.embassies.find((e) => !isValidEmbassy(e));
  if (invalid) {
    return NextResponse.json(
      { error: "One or more entries failed validation", first: invalid },
      { status: 400 }
    );
  }

  try {
    const json = JSON.stringify(body.embassies);
    const result = await uploadToStorage(Buffer.from(json, "utf-8"));
    return NextResponse.json({
      success: true,
      rootHash: result.rootHash,
      count: body.embassies.length,
      hint: "Set NEXT_PUBLIC_EMBASSIES_ROOT_HASH to this rootHash to publish.",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    console.error("[/api/admin/embassies] upload failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
