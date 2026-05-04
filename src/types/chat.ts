export type MessageRole = "user" | "assistant";

export interface ChatSource {
  citation: number;
  country: string;
  flag: string;
  articleTitle: string;
  label: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number; // Unix ms
  /** Which inference provider served this response — for transparency + judge verification */
  provider?: string; // "0g-compute-direct" | "0g-broker" | "groq-fallback" | on-chain provider address
  sources?: ChatSource[];
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
