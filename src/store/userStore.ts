import { create } from "zustand";
import type { UserProfile } from "@/types/user";

interface UserState {
  walletAddress: string | null;
  profile: UserProfile | null;

  setWalletAddress: (address: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  updateStreak: (streak: number, lastActiveDate: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  walletAddress: null,
  profile: null,

  setWalletAddress: (walletAddress) => set({ walletAddress }),

  setProfile: (profile) => set({ profile }),

  updateStreak: (streak, lastActiveDate) =>
    set((state) =>
      state.profile
        ? { profile: { ...state.profile, streak, lastActiveDate } }
        : {}
    ),
}));
