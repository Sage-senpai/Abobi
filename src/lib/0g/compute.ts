/**
 * 0G Compute Network inference wrapper.
 *
 * Two modes:
 * 1. DIRECT API (preferred) — Uses 0G's OpenAI-compatible HTTP endpoint.
 *    Set OG_COMPUTE_API_URL and OG_COMPUTE_API_KEY in .env.local.
 *    No broker SDK needed, no OOM, no provider discovery.
 *
 * 2. BROKER SDK (legacy fallback) — Uses @0glabs/0g-serving-broker for
 *    signed inference through a specific provider address.
 *    Set OG_COMPUTE_PROVIDER_ADDRESS in .env.local.
 *
 * Server-side only. Server wallet funds compute.
 */

import {
  ZEROVIZA_SYSTEM_PROMPT,
  MODEL_ID,
  INFERENCE_CONFIG,
} from "@/lib/zeroviza/prompt";
import type { InferenceMessage } from "@/types/chat";

// ─── Direct API mode ─────────────────────────────────────────────────────────

/**
 * Call 0G Compute Network via its OpenAI-compatible REST API.
 * This is the recommended approach — lightweight, no SDK dependency for inference.
 *
 * Env vars:
 *   OG_COMPUTE_API_URL  — e.g. https://compute-network-1.integratenetwork.work/v1
 *   OG_COMPUTE_API_KEY  — e.g. app-sk-xxx (from 0G dashboard)
 */
async function callDirectAPI(
  messages: InferenceMessage[],
  modelId: string
): Promise<{ content: string }> {
  const apiUrl = process.env.OG_COMPUTE_API_URL!;
  const apiKey = process.env.OG_COMPUTE_API_KEY!;

  const endpoint = `${apiUrl.replace(/\/+$/, "")}/chat/completions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: INFERENCE_CONFIG.maxTokens,
      temperature: INFERENCE_CONFIG.temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`0G Compute API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("0G Compute returned empty response");

  return { content };
}

// ─── Broker SDK mode (legacy) ────────────────────────────────────────────────

import { ethers } from "ethers";

type ZGBroker = Awaited<ReturnType<typeof initBroker>>;
let _brokerPromise: Promise<ZGBroker> | null = null;

async function initBroker() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker") as typeof import("@0glabs/0g-serving-broker");

  // Use dedicated compute RPC (mainnet) — separate from testnet used for contracts/storage
  const rpcUrl = process.env.OG_COMPUTE_RPC_URL ?? process.env.NEXT_PUBLIC_0G_RPC_URL;
  const privateKey = process.env.OG_SERVER_PRIVATE_KEY;
  if (!rpcUrl || !privateKey) {
    throw new Error("Missing env vars: OG_COMPUTE_RPC_URL, OG_SERVER_PRIVATE_KEY");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider) as unknown as Parameters<typeof createZGComputeNetworkBroker>[0];
  return createZGComputeNetworkBroker(wallet);
}

function getBroker() {
  if (!_brokerPromise) {
    _brokerPromise = initBroker().catch((err) => {
      _brokerPromise = null;
      throw err;
    });
  }
  return _brokerPromise;
}

async function callBrokerAPI(
  messages: InferenceMessage[],
  modelId: string
): Promise<{ content: string; providerAddress: string }> {
  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  if (!providerAddress) {
    throw new Error("OG_COMPUTE_PROVIDER_ADDRESS env var not set");
  }

  const broker = await getBroker();

  const requestBody = {
    model: modelId,
    messages,
    max_tokens: INFERENCE_CONFIG.maxTokens,
    temperature: INFERENCE_CONFIG.temperature,
  };

  const headers = await broker.inference.getRequestHeaders(
    providerAddress,
    JSON.stringify(requestBody)
  );

  const metadata = await broker.inference.getServiceMetadata(providerAddress);
  // metadata.endpoint may already include /v1/proxy — just append /chat/completions
  const baseUrl = metadata.endpoint.replace(/\/+$/, "");
  const endpoint = `${baseUrl}/chat/completions`;

  console.log(`[compute/broker] Calling: ${endpoint} with model: ${modelId}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers as unknown as Record<string, string>),
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Broker inference failed ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const chatId = response.headers.get("ZG-Res-Key") ?? undefined;
  await broker.inference.processResponse(
    providerAddress,
    chatId,
    data.choices[0]?.message?.content
  );

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Broker returned empty response");

  return { content, providerAddress };
}

// ─── Unified inference function ──────────────────────────────────────────────

export interface ZeroVizaResponse {
  content: string;
  providerAddress: string;
}

/**
 * Inference provider priority (highest → lowest):
 *   1. 0G Compute direct API  (OG_COMPUTE_API_URL + OG_COMPUTE_API_KEY)
 *   2. 0G Compute broker SDK  (OG_COMPUTE_PROVIDER_ADDRESS, needs mainnet OG)
 *   3. Groq emergency fallback (GROQ_API_KEY) — ONLY used if both 0G paths fail
 *
 * On every request we try 0G first. Groq is a circuit-breaker so the UI stays
 * responsive even if the mainnet compute provider is temporarily unavailable
 * (e.g. during demo recording or live judge verification).
 */
type InferenceProvider = "0g-direct" | "0g-broker" | "groq-fallback";

function has0GDirect(): boolean {
  return !!(process.env.OG_COMPUTE_API_URL && process.env.OG_COMPUTE_API_KEY);
}

function has0GBroker(): boolean {
  return !!process.env.OG_COMPUTE_PROVIDER_ADDRESS;
}

function hasGroqFallback(): boolean {
  return !!process.env.GROQ_API_KEY;
}

async function callGroqAPI(
  messages: InferenceMessage[]
): Promise<{ content: string }> {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  // Best Groq model for legal reasoning — fast and capable
  const groqModel = "llama-3.3-70b-versatile";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages,
      max_tokens: INFERENCE_CONFIG.maxTokens,
      temperature: INFERENCE_CONFIG.temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned empty response");
  return { content };
}

export async function sendToZeroViza(
  userMessage: string,
  contextHistory: InferenceMessage[] = []
): Promise<ZeroVizaResponse> {
  // Build message array
  const recentContext = contextHistory.slice(-INFERENCE_CONFIG.contextWindow);
  const messages: InferenceMessage[] = [
    { role: "system", content: ZEROVIZA_SYSTEM_PROMPT },
    ...recentContext,
    { role: "user", content: userMessage },
  ];

  const attempts: Array<{ provider: InferenceProvider; error: string }> = [];

  // ── Attempt 1: 0G Compute direct API ─────────────────────────────────────
  if (has0GDirect()) {
    try {
      console.log(`[0G-compute/direct] Calling 0G Compute Network (${MODEL_ID})`);
      const result = await callDirectAPI(messages, MODEL_ID);
      console.log(`[0G-compute/direct] ✓ success`);
      return { content: result.content, providerAddress: "0g-compute-direct" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[0G-compute/direct] ✗ failed: ${msg}`);
      attempts.push({ provider: "0g-direct", error: msg });
    }
  }

  // ── Attempt 2: 0G Compute broker SDK ─────────────────────────────────────
  if (has0GBroker()) {
    try {
      console.log(`[0G-compute/broker] Calling 0G Compute via broker (${MODEL_ID})`);
      const result = await callBrokerAPI(messages, MODEL_ID);
      console.log(`[0G-compute/broker] ✓ success — fee settled on-chain`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[0G-compute/broker] ✗ failed: ${msg}`);
      attempts.push({ provider: "0g-broker", error: msg });
    }
  }

  // ── Attempt 3 (emergency): Groq fallback ─────────────────────────────────
  // Only reached if BOTH 0G paths failed or aren't configured.
  // This exists so the UI stays responsive during live demos even if the
  // mainnet compute provider is temporarily unavailable.
  if (hasGroqFallback()) {
    try {
      console.log(`[groq-fallback] 0G Compute unavailable — using emergency fallback (llama-3.3-70b-versatile)`);
      const result = await callGroqAPI(messages);
      return { content: result.content, providerAddress: "groq-fallback" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ provider: "groq-fallback", error: msg });
    }
  }

  // All providers failed or none configured
  if (attempts.length === 0) {
    throw new Error(
      "No AI inference provider configured. Set one of:\n" +
      "  • OG_COMPUTE_API_URL + OG_COMPUTE_API_KEY (0G Compute direct)\n" +
      "  • OG_COMPUTE_PROVIDER_ADDRESS (0G Compute broker — needs mainnet OG)\n" +
      "  • GROQ_API_KEY (emergency fallback from console.groq.com)"
    );
  }

  const summary = attempts.map((a) => `${a.provider}: ${a.error}`).join(" | ");
  throw new Error(`All inference providers failed. ${summary}`);
}

// ─── Streaming inference ─────────────────────────────────────────────────────

export interface StreamEvent {
  type: "chunk" | "done" | "error";
  content?: string;
  providerAddress?: string;
  error?: string;
}

async function* parseSSEStream(
  response: Response
): AsyncGenerator<string, void, unknown> {
  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const parsed = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // skip malformed chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function* callDirectAPIStream(
  messages: InferenceMessage[],
  modelId: string
): AsyncGenerator<string, void, unknown> {
  const apiUrl = process.env.OG_COMPUTE_API_URL!;
  const apiKey = process.env.OG_COMPUTE_API_KEY!;
  const endpoint = `${apiUrl.replace(/\/+$/, "")}/chat/completions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      max_tokens: INFERENCE_CONFIG.maxTokens,
      temperature: INFERENCE_CONFIG.temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`0G Compute stream error ${response.status}: ${errText}`);
  }

  yield* parseSSEStream(response);
}

async function* callGroqAPIStream(
  messages: InferenceMessage[]
): AsyncGenerator<string, void, unknown> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: INFERENCE_CONFIG.maxTokens,
      temperature: INFERENCE_CONFIG.temperature,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq stream error ${response.status}: ${errText}`);
  }

  yield* parseSSEStream(response);
}

/**
 * Streaming inference. Tries 0G direct → Groq fallback. Yields token deltas;
 * the final accumulated text and provider tag are returned via callback.
 */
export async function* streamFromZeroViza(
  userMessage: string,
  contextHistory: InferenceMessage[] = [],
  groundingContext = ""
): AsyncGenerator<StreamEvent, void, unknown> {
  const recentContext = contextHistory.slice(-INFERENCE_CONFIG.contextWindow);
  const systemContent = groundingContext
    ? ZEROVIZA_SYSTEM_PROMPT + groundingContext
    : ZEROVIZA_SYSTEM_PROMPT;
  const messages: InferenceMessage[] = [
    { role: "system", content: systemContent },
    ...recentContext,
    { role: "user", content: userMessage },
  ];

  const tryProviders: Array<{
    name: "0g-compute-direct" | "groq-fallback";
    enabled: boolean;
    factory: () => AsyncGenerator<string, void, unknown>;
  }> = [
    {
      name: "0g-compute-direct",
      enabled: has0GDirect(),
      factory: () => callDirectAPIStream(messages, MODEL_ID),
    },
    {
      name: "groq-fallback",
      enabled: hasGroqFallback(),
      factory: () => callGroqAPIStream(messages),
    },
  ];

  const errors: string[] = [];

  for (const p of tryProviders) {
    if (!p.enabled) continue;
    try {
      let any = false;
      for await (const chunk of p.factory()) {
        any = true;
        yield { type: "chunk", content: chunk, providerAddress: p.name };
      }
      if (any) {
        yield { type: "done", providerAddress: p.name };
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[stream/${p.name}] failed: ${msg}`);
      errors.push(`${p.name}: ${msg}`);
    }
  }

  yield {
    type: "error",
    error: errors.length ? errors.join(" | ") : "No streaming provider configured",
  };
}

// ─── Setup helpers (broker only) ─────────────────────────────────────────────

export async function acknowledgeProvider(): Promise<void> {
  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  if (!providerAddress) throw new Error("OG_COMPUTE_PROVIDER_ADDRESS not set");

  const broker = await getBroker();
  await broker.inference.acknowledgeProviderSigner(providerAddress);
}

export async function listServices(): Promise<Record<string, unknown>[]> {
  const broker = await getBroker();
  try {
    const services = await broker.inference.listService();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (services ?? []).map((s: any) => ({
      provider: String(s.provider ?? s[0] ?? ""),
      name: String(s.name ?? s.model ?? ""),
      serviceType: String(s.serviceType ?? s[1] ?? ""),
      url: String(s.url ?? s[2] ?? ""),
      model: String(s.model ?? s[6] ?? ""),
    }));
  } catch (err) {
    console.error("[listServices]", err);
    return [];
  }
}
