import "server-only";

/**
 * CaseAgentNFT (ERC-7857) integration — server-side only.
 * Mints, queries, and updates Case Agent INFTs on 0G Aristotle mainnet.
 */

import { ethers } from "ethers";

export const CASE_AGENT_NFT_ABI = [
  { type: "function", name: "owner", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "operator", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "oracle", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "nextId", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "ownerOf", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "tokenURI", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "metadataURI", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "contentHash", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "bytes32" }], stateMutability: "view" },
  { type: "function", name: "sealedKeyOf", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "bytes" }], stateMutability: "view" },
  { type: "function", name: "isExecutorAuthorized", inputs: [{ name: "tokenId", type: "uint256" }, { name: "executor", type: "address" }], outputs: [{ type: "bool" }], stateMutability: "view" },
  {
    type: "function", name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
      { name: "hash_", type: "bytes32" },
      { name: "initialSealedKey", type: "bytes" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "updateMetadata",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "newURI", type: "string" },
      { name: "newContentHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function", name: "authorizeUsage",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "executor", type: "address" },
      { name: "expiresAt", type: "uint256" },
      { name: "permissionsHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event", name: "AgentMinted",
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "metadataURI", type: "string" },
      { indexed: false, name: "contentHash", type: "bytes32" },
    ],
    anonymous: false,
  },
];

export function getCaseAgentNFTAddress(): string | null {
  return process.env.NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS ?? null;
}

function getContract(readOnly = false): ethers.Contract {
  const addr = getCaseAgentNFTAddress();
  if (!addr) throw new Error("NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS not set");
  const rpc = process.env.NEXT_PUBLIC_0G_RPC_URL ?? "https://evmrpc.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpc);

  if (readOnly) {
    return new ethers.Contract(addr, CASE_AGENT_NFT_ABI, provider);
  }
  const pk = process.env.OG_SERVER_PRIVATE_KEY;
  if (!pk) throw new Error("OG_SERVER_PRIVATE_KEY not set");
  return new ethers.Contract(addr, CASE_AGENT_NFT_ABI, new ethers.Wallet(pk, provider));
}

export interface MintAgentArgs {
  to: string;
  metadataURI: string;
  contentHash: string;
  sealedKey: string; // hex
}

export async function mintAgent(args: MintAgentArgs): Promise<{
  tokenId: string;
  txHash: string;
}> {
  const contract = getContract(false);
  const tx = (await contract.mint(
    args.to,
    args.metadataURI,
    args.contentHash,
    args.sealedKey
  )) as ethers.TransactionResponse;
  const receipt = await tx.wait(1);
  if (!receipt) throw new Error("mint receipt was null");

  // Extract tokenId from AgentMinted event
  const iface = new ethers.Interface(CASE_AGENT_NFT_ABI);
  let tokenId: string | null = null;
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed?.name === "AgentMinted") {
        tokenId = (parsed.args[0] as bigint).toString();
        break;
      }
    } catch {
      // not our event
    }
  }
  if (!tokenId) throw new Error("AgentMinted event not found in receipt");

  return { tokenId, txHash: tx.hash };
}

export async function balanceOf(walletAddress: string): Promise<number> {
  const contract = getContract(true);
  const bal = (await contract.balanceOf(walletAddress)) as bigint;
  return Number(bal);
}

export async function getAgentInfo(tokenId: string): Promise<{
  owner: string;
  metadataURI: string;
  contentHash: string;
} | null> {
  const contract = getContract(true);
  try {
    const [owner, metadataURI, contentHash] = await Promise.all([
      contract.ownerOf(tokenId) as Promise<string>,
      contract.metadataURI(tokenId) as Promise<string>,
      contract.contentHash(tokenId) as Promise<string>,
    ]);
    return { owner, metadataURI, contentHash };
  } catch {
    return null;
  }
}

export async function findTokensOwnedBy(walletAddress: string): Promise<string[]> {
  // Lightweight scan: walk token ids 1..nextId and check owner.
  // Fine for hackathon scale; for production, switch to event indexing.
  const contract = getContract(true);
  const next = (await contract.nextId()) as bigint;
  const out: string[] = [];
  const target = walletAddress.toLowerCase();
  for (let i = BigInt(1); i <= next; i++) {
    try {
      const owner = (await contract.ownerOf(i)) as string;
      if (owner.toLowerCase() === target) out.push(i.toString());
    } catch {
      // token doesn't exist (burned/never minted)
    }
  }
  return out;
}

export async function updateAgentMetadata(args: {
  tokenId: string;
  newURI: string;
  newContentHash: string;
}): Promise<string> {
  const contract = getContract(false);
  const tx = (await contract.updateMetadata(
    args.tokenId,
    args.newURI,
    args.newContentHash
  )) as ethers.TransactionResponse;
  await tx.wait(1);
  return tx.hash;
}
