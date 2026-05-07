import "server-only";

import { chatWithTools, streamRawMessages, type StreamEvent } from "@/lib/0g/compute";
import { ZEROVIZA_SYSTEM_PROMPT } from "@/lib/zeroviza/prompt";
import { TOOL_DEFS, executeTool, type ToolResult } from "@/lib/agent/tools";
import type { UserProfile, AgentInboxItem } from "@/types/user";
import type { VisaCase } from "@/types/case";
import type { InferenceMessage } from "@/types/chat";

const MAX_AGENT_ITERATIONS = 4;

export interface AgentLoopEvent {
  kind: "tool_start" | "tool_done" | "tool_error" | "final_chunk" | "final_done" | "error";
  toolName?: string;
  toolCallId?: string;
  uiSummary?: string;
  ok?: boolean;
  content?: string;
  providerAddress?: string;
  error?: string;
  explorerUrl?: string;
  txHash?: string;
}

export interface AgentLoopAccumulator {
  /** Patches to apply to the user's profile before persistence. */
  profilePatch: Partial<UserProfile>;
  /** Inbox items appended during this turn. */
  inboxAppended: AgentInboxItem[];
  /** New cases created during this turn. */
  casesAppended: VisaCase[];
}

interface AgentLoopInput {
  userMessage: string;
  history: InferenceMessage[];
  profile: UserProfile;
  walletAddress: string;
  groundingContext?: string;
}

function personaPreamble(profile: UserProfile): string {
  const p = profile.persona;
  if (!p) return "";
  const lines: string[] = [];
  if (p.citizenship) lines.push(`Citizenship: ${p.citizenship}`);
  if (p.currentCountry) lines.push(`Currently in: ${p.currentCountry}`);
  if (p.targetCountries?.length) lines.push(`Target countries: ${p.targetCountries.join(", ")}`);
  if (p.profession) lines.push(`Profession: ${p.profession}`);
  if (p.educationLevel) lines.push(`Education: ${p.educationLevel}`);
  if (p.family) lines.push(`Family: ${p.family}`);
  if (p.languages?.length) lines.push(`Languages: ${p.languages.join(", ")}`);
  if (p.englishLevel) lines.push(`English: ${p.englishLevel}`);
  if (p.budget) lines.push(`Budget: ${p.budget}`);
  if (p.visaHistory?.length) lines.push(`Visa history: ${p.visaHistory.join("; ")}`);
  if (p.notes) lines.push(`Other: ${p.notes}`);
  if (lines.length === 0) return "";
  return `\n\nKNOWN USER PROFILE (from prior conversations):\n${lines.join("\n")}\n`;
}

function casesPreamble(profile: UserProfile): string {
  const cases = profile.cases ?? [];
  if (cases.length === 0) return "";
  const recent = cases.slice(0, 3);
  const lines = recent.map(
    (c) => `- ${c.country} ${c.visaType} (status: ${c.status}, id: ${c.id})`
  );
  return `\n\nUSER'S OPEN CASES:\n${lines.join("\n")}\n`;
}

const AGENT_GUIDANCE = `

═══════════════════════════════════════════════════════════════
AGENT MODE — TOOL USE
═══════════════════════════════════════════════════════════════

You have function-calling tools. Use them proactively when they would help, but never gratuitously:

- Call \`extract_profile_facts\` whenever the user shares a detail that should persist (citizenship, current country, target country, profession, education, family, English level, budget, prior visa history). Save only what you are confident about.
- Call \`lookup_embassy\` when the user asks where to apply, what number to call, or which mission has jurisdiction. Do not invent phone numbers.
- Call \`find_service_provider\` when the user explicitly asks for a lawyer, RCIC, OISC adviser, MARA agent, translator, evaluator, or notary.
- Call \`hire_provider\` ONLY after a strict three-step confirmation:
  1. The user picked a specific provider from a find_service_provider result.
  2. You quoted the provider's flatRateUSD (or asked for an agreed fee) and the user explicitly said yes/agreed.
  3. You restated what task the provider will perform and the user confirmed.
  Never invent a wallet address. Never hire without explicit consent. Never escalate the fee beyond what the user agreed to.
- Call \`create_case\` ONLY after the user has confirmed they have started or filed a specific application. Do not auto-create on hypothetical questions.

After tools return, write a natural response to the user that incorporates the results. Cite returned facts (phone, fee, provider name) verbatim. Never fabricate values.
`;

export async function* runAgentLoop(
  input: AgentLoopInput
): AsyncGenerator<AgentLoopEvent, AgentLoopAccumulator, unknown> {
  const { userMessage, history, profile, walletAddress, groundingContext = "" } = input;

  const systemContent =
    ZEROVIZA_SYSTEM_PROMPT +
    personaPreamble(profile) +
    casesPreamble(profile) +
    AGENT_GUIDANCE +
    groundingContext;

  // Working messages array (mutated each iteration as tools resolve)
  const messages: unknown[] = [
    { role: "system", content: systemContent },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];

  const acc: AgentLoopAccumulator = {
    profilePatch: {},
    inboxAppended: [],
    casesAppended: [],
  };

  // Tool-call iterations (non-streaming)
  for (let iteration = 0; iteration < MAX_AGENT_ITERATIONS; iteration++) {
    let result;
    try {
      result = await chatWithTools(messages, TOOL_DEFS);
    } catch (err) {
      yield { kind: "error", error: err instanceof Error ? err.message : "Inference failed" };
      return acc;
    }

    if (result.kind === "content") {
      // Final pass: stream the assistant content. We re-run the model in
      // streaming mode using the same messages array so the user sees tokens.
      // The previous non-stream call confirmed the model is done with tools.
      const streamMessages = [...messages]; // last assistant turn intentionally omitted
      let any = false;
      for await (const ev of streamRawMessages(streamMessages)) {
        if (ev.type === "chunk" && ev.content) {
          any = true;
          yield { kind: "final_chunk", content: ev.content, providerAddress: ev.providerAddress };
        } else if (ev.type === "done") {
          yield { kind: "final_done", providerAddress: ev.providerAddress ?? result.providerAddress };
        } else if (ev.type === "error") {
          // Streaming failed but we already have non-stream content; emit it whole.
          if (!any && result.content) {
            yield { kind: "final_chunk", content: result.content, providerAddress: result.providerAddress };
            yield { kind: "final_done", providerAddress: result.providerAddress };
          } else {
            yield { kind: "error", error: ev.error ?? "Stream error" };
          }
          return acc;
        }
      }
      if (!any && result.content) {
        // Streaming returned nothing — fall back to the buffered content.
        yield { kind: "final_chunk", content: result.content, providerAddress: result.providerAddress };
        yield { kind: "final_done", providerAddress: result.providerAddress };
      }
      return acc;
    }

    // Tool calls — execute each
    messages.push(result.rawAssistantMessage);

    for (const call of result.calls) {
      yield {
        kind: "tool_start",
        toolName: call.name,
        toolCallId: call.id,
      };

      let toolResult: ToolResult;
      try {
        toolResult = await executeTool(call.name, call.arguments, {
          walletAddress,
          profile: { ...profile, ...acc.profilePatch } as UserProfile,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Tool failed";
        yield {
          kind: "tool_error",
          toolName: call.name,
          toolCallId: call.id,
          error: msg,
        };
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({ error: msg }),
        });
        continue;
      }

      // Apply mutations to accumulator
      if (toolResult.profilePatch) {
        Object.assign(acc.profilePatch, toolResult.profilePatch);
      }
      if (toolResult.inboxItems?.length) {
        acc.inboxAppended.push(...toolResult.inboxItems);
      }
      if (toolResult.newCases?.length) {
        acc.casesAppended.push(...toolResult.newCases);
      }

      yield {
        kind: "tool_done",
        toolName: call.name,
        toolCallId: call.id,
        ok: toolResult.ok,
        uiSummary: toolResult.uiSummary,
        explorerUrl: toolResult.explorerUrl,
        txHash: toolResult.txHash,
      };

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(toolResult.modelPayload).slice(0, 6000),
      });
    }
    // Loop back to inference with tool results in context
  }

  // Hit iteration limit without a final content response — generate one
  yield { kind: "error", error: "Agent exceeded tool iteration limit" };
  return acc;
}
