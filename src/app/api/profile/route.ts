import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { downloadProfile, uploadProfile } from "@/lib/0g/storage";
import { createDefaultProfile, getStreakData } from "@/lib/zeroviza/streak";

export const maxDuration = 60;

const WalletSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = WalletSchema.safeParse({ wallet: searchParams.get("wallet") });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
    }

    const { wallet } = parsed.data;
    const index = await getStorageIndex(wallet);

    let profile;
    let needsSeed = false;

    if (index?.profileRootHash) {
      try {
        profile = await downloadProfile(index.profileRootHash);
      } catch {
        // 0G download failed transiently — DO NOT regenerate a fresh
        // default; that would reset createdAt every time. Fall through
        // to a default but flag for seeding only if there's no on-chain
        // pointer yet (handled below).
        profile = createDefaultProfile(wallet);
      }
    } else {
      // First-time visitor: create default and persist it so subsequent
      // GETs return the same createdAt instead of a fresh "joined just now".
      profile = createDefaultProfile(wallet);
      needsSeed = true;
    }

    if (needsSeed) {
      try {
        const result = await uploadProfile(profile);
        await upsertStorageIndex(wallet, index?.historyRootHash ?? null, result.rootHash);
      } catch (seedErr) {
        // Non-fatal — return the default; next GET will retry seeding.
        console.warn("[/api/profile GET] failed to seed default profile:", seedErr);
      }
    }

    const streak = getStreakData(profile);

    return NextResponse.json({ profile, streak });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/profile GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// For future profile updates (display name, preferences, etc.)
const PatchSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
    }

    const { wallet } = parsed.data;
    const index = await getStorageIndex(wallet);

    let profile;
    if (index?.profileRootHash) {
      profile = await downloadProfile(index.profileRootHash);
    } else {
      profile = createDefaultProfile(wallet);
    }

    // Apply allowed updates from body (extensible for V2)
    const updatedProfile = { ...profile };

    const result = await uploadProfile(updatedProfile);
    await upsertStorageIndex(wallet, index?.historyRootHash ?? null, result.rootHash);

    return NextResponse.json({ profile: updatedProfile });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/profile PATCH]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
