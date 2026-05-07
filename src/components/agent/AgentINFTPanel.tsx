"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";

interface AgentToken {
  tokenId: string;
  owner?: string;
  metadataURI?: string;
  contentHash?: string;
}

interface AgentStatus {
  minted: boolean;
  tokenIds: string[];
  tokens?: AgentToken[];
  balance: number;
  contractAddress: string | null;
  contractDeployed: boolean;
}

async function fetchStatus(wallet: string): Promise<AgentStatus> {
  const res = await fetch(`/api/agent/status?wallet=${wallet}`);
  if (!res.ok) throw new Error("Failed to load agent status");
  return res.json() as Promise<AgentStatus>;
}

async function mintAgent(wallet: string): Promise<{ tokenId?: string; txHash?: string; alreadyMinted?: boolean; error?: string }> {
  const res = await fetch("/api/agent/mint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: wallet }),
  });
  const data = (await res.json()) as { tokenId?: string; txHash?: string; alreadyMinted?: boolean; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Mint failed");
  return data;
}

const EXPLORER_BASE = "https://chainscan.0g.ai";

export function AgentINFTPanel() {
  const { address, isDemo } = useWallet();
  const queryClient = useQueryClient();
  const [mintTx, setMintTx] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["agent-status", address],
    queryFn: () => fetchStatus(address!),
    enabled: !!address && !isDemo,
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: () => mintAgent(address!),
    onSuccess: (result) => {
      if (result.txHash) setMintTx(result.txHash);
      queryClient.invalidateQueries({ queryKey: ["agent-status", address] });
    },
  });

  if (!address || isDemo) return null;

  // Contract not yet deployed — show "coming soon" CTA
  if (data && !data.contractDeployed) {
    return (
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-5 border border-[#334155]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm flex items-center gap-2">
              Case Agent INFT
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wider">
                ERC-7857
              </span>
            </p>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              Awaiting mainnet deployment of CaseAgentNFT contract
            </p>
          </div>
        </div>
        <p className="text-[#64748B] text-[11px] leading-relaxed">
          Once deployed, you can mint your immigration AI as an INFT you fully own. Encrypted memory on 0G Storage, hash commitment on 0G Chain. Transferable. Cloneable. Yours.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#0F172A] rounded-2xl p-5 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#94A3B8] text-sm">Checking agent INFT…</p>
      </div>
    );
  }

  // Already minted
  if (data?.minted && data.tokens && data.tokens.length > 0) {
    const primary = data.tokens[0];
    return (
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-5 border border-[#DC2626]/40">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.5 8 12 11.82 4.5 8 12 4.18zM4 9.36l7 3.5v7.41l-7-3.5V9.36zm9 10.91v-7.41l7-3.5v7.41l-7 3.5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-white font-bold text-sm">Case Agent INFT</p>
              <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              Token #{primary.tokenId} · ERC-7857 · 0G Aristotle
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="bg-[#1E293B] rounded-lg px-3 py-2">
            <p className="text-[#64748B] text-[10px] uppercase tracking-wider font-bold mb-0.5">Encrypted memory</p>
            <p className="text-white font-mono text-[10px] truncate">
              {primary.metadataURI?.slice(0, 26)}…{primary.metadataURI?.slice(-8)}
            </p>
          </div>
          <div className="bg-[#1E293B] rounded-lg px-3 py-2">
            <p className="text-[#64748B] text-[10px] uppercase tracking-wider font-bold mb-0.5">Content hash (chain commitment)</p>
            <p className="text-white font-mono text-[10px] truncate">
              {primary.contentHash?.slice(0, 26)}…{primary.contentHash?.slice(-8)}
            </p>
          </div>
        </div>

        {data.contractAddress && (
          <a
            href={`${EXPLORER_BASE}/address/${data.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#DC2626] hover:text-red-400 text-[11px] font-semibold transition-colors"
          >
            View contract on 0G Scan
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    );
  }

  // Not yet minted — CTA
  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-5 border border-[#334155]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-bold text-sm">Mint your Case Agent</p>
            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wider">
              ERC-7857
            </span>
          </div>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            Tokenize your immigration AI as an INFT you fully own
          </p>
        </div>
      </div>

      <p className="text-[#94A3B8] text-[11px] leading-relaxed mb-3">
        Your AI agent's encrypted memory (persona, chat history, cases) lives on 0G Storage. The hash commitment lives on 0G Chain. Transferable, cloneable, and authorizable to verified lawyers without giving up ownership.
      </p>

      {mutation.isError && (
        <p className="text-red-400 text-[11px] mb-2">
          {mutation.error instanceof Error ? mutation.error.message : "Mint failed"}
        </p>
      )}

      {mintTx && (
        <a
          href={`${EXPLORER_BASE}/tx/${mintTx}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-green-400 text-[11px] mb-2 truncate font-mono hover:underline"
        >
          ✓ Minted: {mintTx.slice(0, 16)}…
        </a>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full py-2.5 bg-[#DC2626] text-white text-sm font-bold rounded-xl hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {mutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Minting on 0G mainnet…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Mint Case Agent INFT
          </>
        )}
      </button>
    </div>
  );
}
