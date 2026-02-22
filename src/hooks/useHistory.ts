"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";
import type { ChatMessage } from "@/types/chat";

async function fetchHistory(
  wallet: string,
  limit = 50
): Promise<ChatMessage[]> {
  const res = await fetch(`/api/history?wallet=${wallet}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load history");
  const data = (await res.json()) as { messages: ChatMessage[] };
  return data.messages;
}

export function useHistory(limit = 50) {
  const { address } = useWallet();

  return useQuery({
    queryKey: ["history", address, limit],
    queryFn: () => fetchHistory(address!, limit),
    enabled: !!address,
    staleTime: 30_000, // 30 seconds
    retry: 2,
  });
}
