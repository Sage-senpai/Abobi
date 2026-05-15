import type { NextRequest } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { ethers } from "ethers";
import { uploadHistory, downloadHistory, uploadProfile, downloadProfile } from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { calculateStreak, createDefaultProfile } from "@/lib/zeroviza/streak";
import { retrieveArticles, formatRetrievedAsContext } from "@/lib/rag/retriever";
import { runAgentLoop } from "@/lib/agent/loop";
import {
  getCaseAgentNFTAddress,
  findTokensOwnedBy,
  updateAgentMetadata,
} from "@/lib/contracts/CaseAgentNFT";
import type { ChatMessage, InferenceMessage, Attestation } from "@/types/chat";
import type { UserProfile } from "@/types/user";

export const maxDuration = 60;
export const runtime = "nodejs";

const RequestSchema = z.object({
  message: z.string().min(1).max(4000),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

async function persistToStorage(
  walletAddress: string,
  updatedHistory: ChatMessage[],
  baseProfile: UserProfile,
  profilePatch: Partial<UserProfile>,
  newCases: UserProfile["cases"],
  newInbox: UserProfile["agentInbox"],
  index: { historyRootHash?: string | null } | null
) {
  try {
    const merged: UserProfile = {
      ...baseProfile,
      ...profilePatch,
      cases: [...(newCases ?? []), ...(baseProfile.cases ?? [])],
      agentInbox: [...(newInbox ?? []), ...(baseProfile.agentInbox ?? [])].slice(0, 50),
    };
    const withStreak = calculateStreak(merged);

    const [historyResult, profileResult] = await Promise.all([
      uploadHistory(updatedHistory),
      uploadProfile(withStreak),
    ]);

    await upsertStorageIndex(walletAddress, historyResult.rootHash, profileResult.rootHash);
    console.log("[/api/chat/stream] persisted");

    // Sync the user's INFT (if minted) so the chain commitment matches the
    // freshly uploaded encrypted blob. Best-effort: any failure is logged
    // but does not block the chat response.
    if (getCaseAgentNFTAddress()) {
      try {
        const tokens = await findTokensOwnedBy(walletAddress);
        if (tokens.length > 0) {
          const newContentHash = ethers.keccak256(
            ethers.toUtf8Bytes(JSON.stringify(withStreak))
          );
          await updateAgentMetadata({
            tokenId: tokens[0],
            newURI: profileResult.rootHash,
            newContentHash,
          });
          console.log(`[/api/chat/stream] INFT #${tokens[0]} metadata refreshed`);
        }
      } catch (inftErr) {
        console.warn("[/api/chat/stream] INFT metadata refresh failed:", inftErr);
      }
    }
  } catch (err) {
    console.error("[/api/chat/stream] background persist failed:", err);
  }
  void index;
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

  // Load profile + history from 0G
  let history: ChatMessage[] = [];
  let profile: UserProfile | null = null;
  let index: Awaited<ReturnType<typeof getStorageIndex>> = null;
  // If the user already has a profileRootHash on-chain but we fail to
  // download it, we MUST NOT persist a fresh default afterwards — that
  // would wipe their streak, createdAt, cases, persona, and inbox.
  let profileDownloadFailed = false;
  try {
    index = await getStorageIndex(walletAddress);
    if (index?.historyRootHash) {
      try {
        history = await downloadHistory(index.historyRootHash);
      } catch (histErr) {
        console.warn("[/api/chat/stream] history download failed:", histErr);
      }
    }
    if (index?.profileRootHash) {
      try {
        profile = await downloadProfile(index.profileRootHash);
      } catch (profErr) {
        console.warn("[/api/chat/stream] profile download failed — skipping persist:", profErr);
        profile = null;
        profileDownloadFailed = true;
      }
    }
  } catch (idxErr) {
    console.warn("[/api/chat/stream] storage index lookup failed:", idxErr);
    history = [];
  }
  if (!profile) profile = createDefaultProfile(walletAddress);

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

  // RAG retrieval
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
      let attestation: Attestation | undefined;
      let errored: string | null = null;
      const toolCalls: Array<{ name: string; uiSummary: string; ok: boolean; explorerUrl?: string; txHash?: string }> = [];

      const generator = runAgentLoop({
        userMessage: message,
        history: contextHistory,
        profile: profile!,
        walletAddress,
        groundingContext,
      });

      let result;
      try {
        while (true) {
          const next = await generator.next();
          if (next.done) {
            result = next.value;
            break;
          }
          const ev = next.value;
          switch (ev.kind) {
            case "tool_start":
              send({ type: "tool_start", name: ev.toolName, id: ev.toolCallId });
              break;
            case "tool_done":
              toolCalls.push({
                name: ev.toolName ?? "unknown",
                uiSummary: ev.uiSummary ?? "",
                ok: !!ev.ok,
                explorerUrl: ev.explorerUrl,
                txHash: ev.txHash,
              });
              send({
                type: "tool_done",
                name: ev.toolName,
                id: ev.toolCallId,
                ok: ev.ok,
                summary: ev.uiSummary,
                explorerUrl: ev.explorerUrl,
                txHash: ev.txHash,
              });
              break;
            case "tool_error":
              toolCalls.push({
                name: ev.toolName ?? "unknown",
                uiSummary: ev.error ?? "Tool failed",
                ok: false,
              });
              send({ type: "tool_error", name: ev.toolName, error: ev.error });
              break;
            case "final_chunk":
              if (ev.content) {
                accumulated += ev.content;
                if (ev.providerAddress) provider = ev.providerAddress;
                send({ type: "chunk", content: ev.content });
              }
              break;
            case "final_done":
              if (ev.providerAddress) provider = ev.providerAddress;
              if (ev.attestation) {
                attestation = {
                  providerAddress: ev.attestation.providerAddress,
                  resKey: ev.attestation.resKey,
                  responseId: ev.attestation.responseId,
                  latencyMs: ev.attestation.latencyMs,
                  model: ev.attestation.model,
                };
                send({ type: "attestation", attestation });
              }
              break;
            case "error":
              errored = ev.error ?? "Agent error";
              break;
          }
        }
      } catch (err) {
        errored = err instanceof Error ? err.message : "Agent failed";
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
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        attestation,
      };

      const acc = result ?? { profilePatch: {}, casesAppended: [], inboxAppended: [] };

      // Surface AI-created cases + inbox items on the SSE stream so the
      // client can hydrate its local Zustand stores immediately. Otherwise
      // they would only appear after a full page refresh.
      send({
        type: "done",
        message: assistantMsg,
        newCases: acc.casesAppended,
        newInboxItems: acc.inboxAppended,
      });
      controller.close();

      // Skip persist if we couldn't load the user's real profile this turn —
      // otherwise we'd overwrite their streak / createdAt / cases / persona
      // with a fresh default.
      if (profileDownloadFailed) {
        console.warn("[/api/chat/stream] skipped persist — profile load failed earlier this turn");
        return;
      }

      const updatedHistory = [...history, userMsg, assistantMsg];
      persistToStorage(
        walletAddress,
        updatedHistory,
        profile!,
        acc.profilePatch,
        acc.casesAppended,
        acc.inboxAppended,
        index
      ).catch(() => {});
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
