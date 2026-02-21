import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStorageIndex } from "@/lib/db/client";
import { downloadHistory } from "@/lib/0g/storage";

const QuerySchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
      wallet: searchParams.get("wallet"),
      limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { wallet, limit } = parsed.data;

    const index = getStorageIndex(wallet);
    if (!index?.historyRootHash) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await downloadHistory(index.historyRootHash);

    // Return most recent `limit` messages
    const paginated = messages.slice(-limit);

    return NextResponse.json({ messages: paginated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/history]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
