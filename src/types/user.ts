import type { VisaCase } from "@/types/case";

export interface UserPersona {
  citizenship?: string;
  currentCountry?: string;
  targetCountries?: string[];
  profession?: string;
  educationLevel?: string;
  family?: string;
  languages?: string[];
  englishLevel?: string;
  budget?: string;
  visaHistory?: string[];
  notes?: string;
  updatedAt: number;
}

export interface AgentInboxItem {
  id: string;
  createdAt: number;
  type: "tool-result" | "reminder" | "case-update" | "system";
  title: string;
  detail?: string;
  caseId?: string;
  read: boolean;
}

export interface UserProfile {
  walletAddress: string;
  streak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  totalMessages: number;
  createdAt: number; // Unix ms
  cases?: VisaCase[];
  persona?: UserPersona;
  agentInbox?: AgentInboxItem[];
}

export interface StreakData {
  current: number;
  lastActiveDate: string;
  isActiveToday: boolean;
}

// API shapes
export interface ProfileResponse {
  profile: UserProfile;
  streak: StreakData;
}
