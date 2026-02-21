"use client";

import { useProfile } from "./useProfile";
import type { StreakData } from "@/types/user";

export function useStreak(): { streak: StreakData | null; isLoading: boolean } {
  const { data, isLoading } = useProfile();
  return {
    streak: data?.streak ?? null,
    isLoading,
  };
}
