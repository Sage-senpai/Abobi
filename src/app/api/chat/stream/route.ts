import type { NextRequest } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { streamFromZeroViza } from "@/lib/0g/compute";
import { uploadHistory, downloadHistory, uploadProfile, downloadProfile } from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { calculateStreak, createDefaultProfile } from "@/lib/zeroviza/streak";
import { retrieveArticles, formatRetrievedAsContext } from "@/lib/rag/retriever";
import type { ChatMessage, InferenceMessage } from "@/types/chat";

export const maxDuration = 60;
export const runtime = "nodejs";

const RequestSchema = z.object({
  message: z.string().min(1).max(4000),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

async function persistToStorage(
  walletAddress: string,
  updatedHistory: ChatMessage[],
  index: { profileRootHash?: string | null } | null
) {
  try {
    let profile = null;
    if (index?.profileRootHash) {
      try {
        profile = await downloadProfile(index.profileRootHash);
      } catch {
        profile = null;
      }
    }
    if (!profile) profile = createDefaultProfile(walletAddress);
    const updatedProfile = calculateStreak(profile);

    const [historyResult, profileResult] = await Promise.all([
      uploadHistory(updatedHistory),
      uploadProfile(updatedProfile),
    ]);

    await upsertStorageIndex(walletAddress, historyResult.rootHash, profileResult.rootHash);
    console.log("[/api/chat/stream] persisted");
  } catch (err) {
    console.error("[/api/chat/stream] background persist failed:", err);
  }
}

function sseEvent(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const { message, walletAddress } = parsed.data;

  // Load history before streaming begins
  let history: ChatMessage[] = [];
  let index: Awaited<ReturnType<typeof getStorageIndex>> = null;
  try {
    index = await getStorageIndex(walletAddress);
    if (index?.historyRootHash) {
      history = await downloadHistory(index.historyRootHash);
    }
  } catch {
    history = [];
  }

  const contextHistory: InferenceMessage[] = history
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));

  const userMsg: ChatMessage = {
    id: nanoid(),
    role: "user",
    content: message,
    timestamp: Date.now(),
  };
  const assistantId = nanoid();

  // Retrieve grounding context from the resource library
  const retrieved = retrieveArticles(message, 3);
  const groundingContext = formatRetrievedAsContext(retrieved);
  const sources = retrieved.flatMap((r, i) =>
    r.sources.slice(0, 2).map((s) => ({
      citation: i + 1,
      country: r.country,
      flag: r.flag,
      articleTitle: r.title,
      label: s.label,
      url: s.url,
    }))
  );

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (obj: object) => controller.enqueue(encoder.encode(sseEvent(obj)));

      send({ type: "start", assistantId, userMessageId: userMsg.id });
      if (sources.length > 0) {
        send({ type: "sources", sources });
      }

      let accumulated = "";
      let provider = "unknown";
      let errored: string | null = null;

      try {
        for await (const ev of streamFromZeroViza(message, contextHistory, groundingContext)) {
          if (ev.type === "chunk" && ev.content) {
            accumulated += ev.content;
            if (ev.providerAddress) provider = ev.providerAddress;
            send({ type: "chunk", content: ev.content });
          } else if (ev.type === "done") {
            if (ev.providerAddress) provider = ev.providerAddress;
          } else if (ev.type === "error") {
            errored = ev.error ?? "Stream error";
          }
        }
      } catch (err) {
        errored = err instanceof Error ? err.message : "Stream failed";
      }

      if (errored && !accumulated) {
        send({ type: "error", error: errored });
        controller.close();
        return;
      }

      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: accumulated,
        timestamp: Date.now(),
        provider,
        sources: sources.length > 0 ? sources : undefined,
      };
      send({ type: "done", message: assistantMsg });
      controller.close();

      // Background persist after stream closes
      const updatedHistory = [...history, userMsg, assistantMsg];
      persistToStorage(walletAddress, updatedHistory, index).catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
