import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { sendToAbobi } from "@/lib/0g/compute";
import {
  uploadHistory,
  downloadHistory,
} from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { calculateStreak, createDefaultProfile } from "@/lib/abobi/streak";
import { uploadProfile, downloadProfile } from "@/lib/0g/storage";
import type { ChatMessage, InferenceMessage } from "@/types/chat";

const RequestSchema = z.object({
  message: z.string().min(1).max(4000),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, walletAddress } = parsed.data;

    // 1. Load existing history and profile from 0G Storage
    const index = getStorageIndex(walletAddress);

    let history: ChatMessage[] = [];
    if (index?.historyRootHash) {
      try {
        history = await downloadHistory(index.historyRootHash);
      } catch {
        // First time or corrupted — start fresh
        history = [];
      }
    }

    // Build context for inference (recent messages only)
    const contextHistory: InferenceMessage[] = history
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    // 2. Run inference via 0G Compute
    const { content } = await sendToAbobi(message, contextHistory);

    // 3. Create new messages
    const userMsg: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    const assistantMsg: ChatMessage = {
      id: nanoid(),
      role: "assistant",
      content,
      timestamp: Date.now(),
    };

    const updatedHistory = [...history, userMsg, assistantMsg];

    // 4. Load or create profile, update streak
    let profile = null;
    if (index?.profileRootHash) {
      try {
        profile = await downloadProfile(index.profileRootHash);
      } catch {
        profile = null;
      }
    }

    if (!profile) {
      profile = createDefaultProfile(walletAddress);
    }

    const updatedProfile = calculateStreak(profile);
    const streakUpdated = updatedProfile.streak !== profile.streak;

    // 5. Upload both history and profile to 0G Storage (parallel)
    const [historyResult, profileResult] = await Promise.all([
      uploadHistory(updatedHistory),
      uploadProfile(updatedProfile),
    ]);

    // 6. Update SQLite index
    upsertStorageIndex(
      walletAddress,
      historyResult.rootHash,
      profileResult.rootHash
    );

    return NextResponse.json({
      message: assistantMsg,
      streakUpdated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/chat]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
