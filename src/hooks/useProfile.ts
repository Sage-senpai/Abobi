"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { ProfileResponse } from "@/types/user";

async function fetchProfile(wallet: string): Promise<ProfileResponse> {
  const res = await fetch(`/api/profile?wallet=${wallet}`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json() as Promise<ProfileResponse>;
}

export function useProfile() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["profile", address],
    queryFn: () => fetchProfile(address!),
    enabled: !!address,
    staleTime: 60_000, // 1 minute
    retry: 2,
  });
}
