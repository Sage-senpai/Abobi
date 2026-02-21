import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { UserProfile, StreakData } from "@/types/user";

export function todayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function calculateStreak(profile: UserProfile): UserProfile {
  const today = todayString();
  const last = profile.lastActiveDate;

  // Already tracked today — no change
  if (last === today) return profile;

  const diff = last
    ? differenceInCalendarDays(parseISO(today), parseISO(last))
    : null;

  // Continue streak if consecutive day, otherwise reset to 1
  const newStreak = diff === 1 ? profile.streak + 1 : 1;

  return {
    ...profile,
    streak: newStreak,
    lastActiveDate: today,
    totalMessages: profile.totalMessages + 1,
  };
}

export function getStreakData(profile: UserProfile): StreakData {
  const today = todayString();
  return {
    current: profile.streak,
    lastActiveDate: profile.lastActiveDate,
    isActiveToday: profile.lastActiveDate === today,
  };
}

export function createDefaultProfile(walletAddress: string): UserProfile {
  return {
    walletAddress,
    streak: 0,
    lastActiveDate: "",
    totalMessages: 0,
    createdAt: Date.now(),
  };
}
