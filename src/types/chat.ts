export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number; // Unix ms
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
  streakUpdated: boolean;
}

// For OpenAI-compatible inference API
export interface InferenceMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
