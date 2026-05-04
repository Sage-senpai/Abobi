import type { VisaCase } from "@/types/case";

export interface UserProfile {
  walletAddress: string;
  streak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  totalMessages: number;
  createdAt: number; // Unix ms
  cases?: VisaCase[];
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
