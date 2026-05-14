export type MessageRole = "user" | "assistant";

export interface ChatSource {
  citation: number;
  country: string;
  flag: string;
  articleTitle: string;
  label: string;
  url: string;
}

export interface ToolCallSummary {
  name: string;
  uiSummary: string;
  ok: boolean;
  /** Optional on-chain receipt link (e.g. for hire_provider). */
  explorerUrl?: string;
  /** Optional short transaction hash for display. */
  txHash?: string;
}

export interface Attestation {
  /** Provider wallet that served this response (0x... on 0G mainnet). */
  providerAddress: string;
  /** 0G receipt key (ZG-Res-Key header) — broker uses this for processResponse verification. */
  resKey?: string;
  /** Provider's chat completion ID. */
  responseId?: string;
  /** Inference latency in ms reported by the provider. */
  latencyMs?: number;
  /** Model that produced the response. */
  model?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number; // Unix ms
  /** Which inference provider served this response — for transparency + judge verification */
  provider?: string; // "0g-compute-direct" | "0g-broker" | "groq-fallback" | on-chain provider address
  sources?: ChatSource[];
  toolCalls?: ToolCallSummary[];
  attestation?: Attestation;
}

export interface ChatSession {
  walletAddress: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

// API request/response shapes
export interface ChatRequest {
  message: string;
  walletAddress: string;
}

export interface ChatResponse {
  message: ChatMessage;
}

// For OpenAI-compatible inference API
export interface InferenceMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
