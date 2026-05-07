/**
 * GET /api/agent/status?wallet=0x...
 * Returns: { minted: bool, tokenIds: string[], balance: number, contractAddress }
 */

import { NextRequest, NextResponse } from "next/server";
import { balanceOf, findTokensOwnedBy, getCaseAgentNFTAddress, getAgentInfo } from "@/lib/contracts/CaseAgentNFT";

export const runtime = "nodejs";
const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  const contractAddress = getCaseAgentNFTAddress();
  if (!contractAddress) {
    return NextResponse.json({
      minted: false,
      tokenIds: [],
      balance: 0,
      contractAddress: null,
      contractDeployed: false,
    });
  }

  try {
    const balance = await balanceOf(wallet);
    if (balance === 0) {
      return NextResponse.json({
        minted: false,
        tokenIds: [],
        balance: 0,
        contractAddress,
        contractDeployed: true,
      });
    }
    const tokenIds = await findTokensOwnedBy(wallet);
    const tokens = await Promise.all(
      tokenIds.map(async (id) => {
        const info = await getAgentInfo(id);
        return { tokenId: id, ...info };
      })
    );
    return NextResponse.json({
      minted: true,
      tokenIds,
      tokens,
      balance,
      contractAddress,
      contractDeployed: true,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
