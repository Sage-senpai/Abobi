/**
 * POST /api/agent/hire
 *
 * Direct UI-driven version of the agent's hire_provider tool. Used by the
 * "Hire on chain" button on each /lawyers card so a judge can demo the
 * agent-to-agent payment flow without depending on qwen actually invoking
 * the tool through chat.
 *
 * Body: { walletAddress, providerWallet, taskDescription, agreedFeeUSD }
 *
 * Records the hire as a tiny native 0G transfer (0.0001 OG) from the
 * operator wallet to the provider's wallet, with the full hire receipt JSON
 * (user wallet, task, fee, INFT tokenId if any) encoded in the tx calldata.
 * The chain is the receipt — viewable on chainscan.0g.ai.
 *
 * For demo personas (isDemo=true), also generates a simulated reply from
 * the persona via 0G Compute using their personaPrompt.
 */

import { NextRequest, NextResponse } from "next/server";
import { hireProvider } from "@/lib/agent/hire";
import { getLawyerByWallet } from "@/lib/db/client";
import { findTokensOwnedBy, getCaseAgentNFTAddress } from "@/lib/contracts/CaseAgentNFT";
import { chatWithTools } from "@/lib/0g/compute";

export const maxDuration = 60;
export const runtime = "nodejs";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

interface Body {
  walletAddress?: string;
  providerWallet?: string;
  taskDescription?: string;
  agreedFeeUSD?: number;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { walletAddress, providerWallet, taskDescription, agreedFeeUSD } = body;

  if (!walletAddress || !WALLET_RE.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }
  if (!providerWallet || !WALLET_RE.test(providerWallet)) {
    return NextResponse.json({ error: "Invalid provider wallet" }, { status: 400 });
  }
  if (!taskDescription?.trim()) {
    return NextResponse.json({ error: "Task description is required" }, { status: 400 });
  }
  if (typeof agreedFeeUSD !== "number" || agreedFeeUSD <= 0 || agreedFeeUSD > 10_000) {
    return NextResponse.json({ error: "Agreed fee must be between 1 and 10000 USD" }, { status: 400 });
  }

  // Verify provider is in the on-chain registry, verified, and accepting hires
  const provider = await getLawyerByWallet(providerWallet);
  if (!provider || provider.status !== "verified") {
    return NextResponse.json(
      { error: "Provider is not in the verified registry" },
      { status: 404 }
    );
  }
  if (!provider.acceptsHires) {
    return NextResponse.json(
      { error: `${provider.fullName} is not currently accepting agent hires` },
      { status: 403 }
    );
  }

  // If the user has minted a Case Agent INFT, bind the hire receipt to it
  let caseAgentTokenId: string | null = null;
  if (getCaseAgentNFTAddress()) {
    try {
      const tokens = await findTokensOwnedBy(walletAddress);
      caseAgentTokenId = tokens[0] ?? null;
    } catch {
      // Not fatal — hire can proceed without an INFT
    }
  }

  // On-chain hire — operator sends 0.0001 OG to provider with receipt in calldata
  let hire;
  try {
    hire = await hireProvider({
      userWallet: walletAddress,
      providerWallet,
      taskDescription: taskDescription.trim(),
      agreedFeeUSD,
      caseAgentTokenId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Hire transaction failed";
    console.error("[/api/agent/hire]", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // For demo personas, generate a simulated reply via 0G Compute using their
  // personaPrompt. Best-effort — the on-chain hire succeeded regardless.
  let demoReply: string | null = null;
  if (provider.isDemo && provider.personaPrompt) {
    try {
      const result = await chatWithTools(
        [
          { role: "system", content: provider.personaPrompt },
          {
            role: "user",
            content: `A new client just hired you for the following task. Acknowledge the hire, ask one or two clarifying questions, and outline the first 2-3 concrete steps you will take. Keep it under 200 words.\n\nTask: ${taskDescription.trim()}`,
          },
        ],
        []
      );
      if (result.kind === "content" && result.content) {
        demoReply = result.content.trim();
      }
    } catch (err) {
      console.warn("[/api/agent/hire] demo reply generation failed:", err);
    }
  }

  return NextResponse.json({
    success: true,
    provider: provider.fullName,
    providerWallet,
    agreedFeeUSD,
    isDemo: !!provider.isDemo,
    txHash: hire.txHash,
    blockNumber: hire.blockNumber,
    receiptHash: hire.receiptHash,
    feeOG: hire.feeOG,
    caseAgentTokenId,
    explorerUrl: `https://chainscan.0g.ai/tx/${hire.txHash}`,
    demoReply,
  });
}
