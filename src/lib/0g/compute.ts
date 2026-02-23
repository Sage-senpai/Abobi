/**
 * 0G Compute Network inference wrapper.
 *
 * Purpose:    Send chat messages to 0G's decentralized inference network
 *             and receive Abobi's Pidgin responses.
 * Depends on: @0glabs/0g-serving-broker, ethers
 * Used by:    /api/chat route
 *
 * Server-side only. Server wallet funds compute.
 *
 * API note: broker.inference.* contains all inference methods.
 * broker.ledger.* handles fund management.
 */

import { ethers } from "ethers";
import {
  ABOBI_SYSTEM_PROMPT,
  MODEL_ID,
  INFERENCE_CONFIG,
} from "@/lib/abobi/prompt";
import type { InferenceMessage } from "@/types/chat";

// ─── Lazy broker factory (cached per process) ─────────────────────────────────
type ZGBroker = Awaited<ReturnType<typeof initBroker>>;
let _brokerPromise: Promise<ZGBroker> | null = null;

async function initBroker() {
  // Use require() — dynamic import() triggers Node.js ESM loader which cannot
  // resolve named exports from the CJS bundle inside @0glabs/0g-serving-broker.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker") as typeof import("@0glabs/0g-serving-broker");

  const rpcUrl = process.env.NEXT_PUBLIC_0G_RPC_URL;
  const privateKey = process.env.OG_SERVER_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error(
      "Missing 0G Compute env vars: NEXT_PUBLIC_0G_RPC_URL, OG_SERVER_PRIVATE_KEY"
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  // Cast wallet — 0g-serving-broker uses its own ethers version (6.13.1)
  // but is runtime compatible with 6.16.0. The cast avoids the private
  // class field mismatch between ESM and CJS ethers builds.
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

// ─── Main inference function ──────────────────────────────────────────────────
export interface AbobiResponse {
  content: string;
  providerAddress: string;
}

export async function sendToAbobi(
  userMessage: string,
  contextHistory: InferenceMessage[] = []
): Promise<AbobiResponse> {
  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  if (!providerAddress) {
    throw new Error("OG_COMPUTE_PROVIDER_ADDRESS env var not set");
  }

  const broker = await getBroker();

  // Build message array: system + context (last N) + new user message
  const recentContext = contextHistory.slice(-INFERENCE_CONFIG.contextWindow);
  const messages: InferenceMessage[] = [
    { role: "system", content: ABOBI_SYSTEM_PROMPT },
    ...recentContext,
    { role: "user", content: userMessage },
  ];

  const requestBody = {
    model: MODEL_ID,
    messages,
    max_tokens: INFERENCE_CONFIG.maxTokens,
    temperature: INFERENCE_CONFIG.temperature,
  };

  // Get signed headers from broker.inference
  const headers = await broker.inference.getRequestHeaders(
    providerAddress,
    JSON.stringify(requestBody)
  );

  // Get provider endpoint from broker.inference
  const metadata = await broker.inference.getServiceMetadata(providerAddress);
  const endpoint = `${metadata.endpoint}/v1/proxy/chat/completions`;

  // Call the inference endpoint
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
    throw new Error(`Inference request failed ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  // Extract chatID from response header for fee settlement
  const chatId = response.headers.get("ZG-Res-Key") ?? undefined;

  // Settle fees via broker.inference
  await broker.inference.processResponse(
    providerAddress,
    chatId,
    data.choices[0]?.message?.content
  );

  const content =
    data.choices[0]?.message?.content ??
    "E no respond, abeg try again!";

  return { content, providerAddress };
}

// ─── One-time provider acknowledgment (run during setup) ─────────────────────
export async function acknowledgeProvider(): Promise<void> {
  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  if (!providerAddress) throw new Error("OG_COMPUTE_PROVIDER_ADDRESS not set");

  const broker = await getBroker();
  await broker.inference.acknowledgeProviderSigner(providerAddress);
}
