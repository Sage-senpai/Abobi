import "server-only";

import { ethers } from "ethers";

const HIRE_FEE_OG = "0.0001";

export interface HireReceipt {
  v: 1;
  type: "zv-agent-hire";
  user: string;
  provider: string;
  task: string;
  agreedFeeUSD: number;
  caseAgentTokenId?: string | null;
  timestamp: number;
}

export interface HireResult {
  txHash: string;
  feeOG: string;
  receiptHash: string;
  blockNumber: number;
  receipt: HireReceipt;
}

/**
 * Pay a verified service provider on the user's behalf and record the hire
 * receipt on chain via the tx calldata.
 *
 * The operator wallet sends a tiny native 0G transfer (HIRE_FEE_OG, default
 * 0.0001) to the provider's wallet. The full hire metadata is encoded as
 * UTF-8 JSON in the tx calldata so it can be inspected on chainscan.0g.ai
 * by clicking the tx and reading the "Input Data" field.
 *
 * Returns the tx hash + the keccak256 of the receipt body. The receipt hash
 * is what other systems can use to attest the user authorized this hire.
 */
export async function hireProvider(args: {
  userWallet: string;
  providerWallet: string;
  taskDescription: string;
  agreedFeeUSD: number;
  caseAgentTokenId?: string | null;
}): Promise<HireResult> {
  const rpcUrl = process.env.NEXT_PUBLIC_0G_RPC_URL ?? "https://evmrpc.0g.ai";
  const pk = process.env.OG_SERVER_PRIVATE_KEY;
  if (!pk) throw new Error("OG_SERVER_PRIVATE_KEY not set");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);

  const receipt: HireReceipt = {
    v: 1,
    type: "zv-agent-hire",
    user: args.userWallet,
    provider: args.providerWallet,
    task: args.taskDescription.slice(0, 280),
    agreedFeeUSD: Math.max(0, Math.min(10_000, args.agreedFeeUSD)),
    caseAgentTokenId: args.caseAgentTokenId ?? null,
    timestamp: Date.now(),
  };
  const receiptJson = JSON.stringify(receipt);
  const receiptBytes = ethers.toUtf8Bytes(receiptJson);
  const receiptHash = ethers.keccak256(receiptBytes);

  const tx = (await wallet.sendTransaction({
    to: args.providerWallet,
    value: ethers.parseEther(HIRE_FEE_OG),
    data: ethers.hexlify(receiptBytes),
  })) as ethers.TransactionResponse;

  const txReceipt = await tx.wait(1);
  if (!txReceipt) throw new Error("Hire transaction receipt was null");

  return {
    txHash: tx.hash,
    feeOG: HIRE_FEE_OG,
    receiptHash,
    blockNumber: txReceipt.blockNumber,
    receipt,
  };
}
