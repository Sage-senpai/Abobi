import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { UserProfile, StreakData } from "@/types/user";

export function todayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function calculateStreak(profile: UserProfile): UserProfile {
  const today = todayString();
  const last = profile.lastActiveDate;

  // totalMessages tracks "questions asked" — bump on every chat turn,
  // not just the first one of the day. Previously this lived inside the
  // streak-update branch below, which meant the counter only moved once
  // per calendar day.
  const nextTotalMessages = profile.totalMessages + 1;

  // Same-day chat: keep streak + lastActiveDate, just bump the counter.
  if (last === today) {
    return { ...profile, totalMessages: nextTotalMessages };
  }

  const diff = last
    ? differenceInCalendarDays(parseISO(today), parseISO(last))
    : null;

  // Continue streak if consecutive day, otherwise reset to 1.
  // First chat ever (diff === null) seeds at 1.
  const newStreak = diff === 1 ? profile.streak + 1 : 1;

  return {
    ...profile,
    streak: newStreak,
    lastActiveDate: today,
    totalMessages: nextTotalMessages,
  };
}

export function getStreakData(profile: UserProfile): StreakData {
  const today = todayString();
  const last = profile.lastActiveDate;

  if (!last) {
    return { current: 0, lastActiveDate: "", isActiveToday: false };
  }

  if (last === today) {
    return { current: profile.streak, lastActiveDate: last, isActiveToday: true };
  }

  const daysSince = differenceInCalendarDays(parseISO(today), parseISO(last));

  // 1 day gap: streak still alive but at risk (user hasn't checked in today)
  if (daysSince === 1) {
    return { current: profile.streak, lastActiveDate: last, isActiveToday: false };
  }

  // 2+ day gap: streak is broken until next activity
  return { current: 0, lastActiveDate: last, isActiveToday: false };
}

export function createDefaultProfile(walletAddress: string): UserProfile {
  return {
    walletAddress,
    streak: 0,
    lastActiveDate: "",
    totalMessages: 0,
    createdAt: Date.now(),
    cases: [],
  };
}
