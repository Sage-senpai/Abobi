/**
 * POST /api/agent/mint
 * Mints a CaseAgent INFT for the user.
 *
 * Body: { walletAddress }
 *
 * Flow:
 *   1. Load the user's profile from 0G Storage (via StorageIndex).
 *   2. Compute a content hash over the JSON profile blob.
 *   3. Mint the INFT to the user's wallet, pointing metadataURI at the
 *      existing profileRoot, with the operator-encrypted sealed key
 *      (placeholder for hackathon — production would re-encrypt off-chain
 *      with the user's pubkey via the oracle).
 *   4. Return tokenId + txHash.
 */

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { downloadProfile } from "@/lib/0g/storage";
import { getStorageIndex } from "@/lib/db/client";
import { mintAgent, balanceOf, findTokensOwnedBy, getCaseAgentNFTAddress } from "@/lib/contracts/CaseAgentNFT";
import { createDefaultProfile } from "@/lib/zeroviza/streak";

export const maxDuration = 60;
export const runtime = "nodejs";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export async function POST(req: NextRequest) {
  if (!getCaseAgentNFTAddress()) {
    return NextResponse.json(
      { error: "CaseAgentNFT contract not deployed yet (NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS missing)" },
      { status: 503 }
    );
  }

  let body: { walletAddress?: string };
  try {
    body = (await req.json()) as { walletAddress?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const wallet = body.walletAddress;
  if (!wallet || !WALLET_RE.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  try {
    // Idempotency check
    const existing = await balanceOf(wallet);
    if (existing > 0) {
      const tokens = await findTokensOwnedBy(wallet);
      return NextResponse.json({
        alreadyMinted: true,
        tokenIds: tokens,
      });
    }

    // Load profile (creates a default if none exists)
    const index = await getStorageIndex(wallet);
    let profile = null;
    if (index?.profileRootHash) {
      try {
        profile = await downloadProfile(index.profileRootHash);
      } catch {
        profile = null;
      }
    }
    if (!profile) profile = createDefaultProfile(wallet);

    const profileRoot = index?.profileRootHash;
    if (!profileRoot) {
      return NextResponse.json(
        { error: "No profile blob found on 0G yet. Send a chat message first so the agent has memory to seal." },
        { status: 400 }
      );
    }

    // Content hash binds the chain commitment to the encrypted blob
    const profileJson = JSON.stringify(profile);
    const contentHash = ethers.keccak256(ethers.toUtf8Bytes(profileJson));

    // Sealed key (placeholder — production would oracle-re-encrypt with user pubkey)
    const sealedKey = ethers.hexlify(ethers.toUtf8Bytes(`zv-sealed-v1:${wallet}:${Date.now()}`));

    const result = await mintAgent({
      to: wallet,
      metadataURI: profileRoot,
      contentHash,
      sealedKey,
    });

    return NextResponse.json({
      success: true,
      tokenId: result.tokenId,
      txHash: result.txHash,
      metadataURI: profileRoot,
      contentHash,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Mint failed";
    console.error("[/api/agent/mint]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
