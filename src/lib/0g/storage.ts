/**
 * 0G Storage SDK wrapper.
 *
 * Purpose:    Upload/download chat history and user profiles to 0G decentralized storage.
 * Depends on: @0glabs/0g-ts-sdk, ethers
 * Used by:    /api/chat, /api/history, /api/profile routes
 *
 * Server-side only. The server wallet funds storage transactions.
 */

import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { ethers } from "ethers";
import type { UploadResult } from "@/types/storage";

// ─── Lazy SDK imports (avoids bundling issues) ────────────────────────────────
async function getSdk() {
  // Use require() — dynamic import() triggers Node.js ESM loader which cannot
  // resolve named exports from the CJS bundle inside @0glabs/0g-ts-sdk.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ZgFile, Indexer } = require("@0glabs/0g-ts-sdk") as typeof import("@0glabs/0g-ts-sdk");
  return { ZgFile, Indexer };
}

// ─── Client factory ───────────────────────────────────────────────────────────
function getStorageClients() {
  const rpcUrl = process.env.NEXT_PUBLIC_0G_RPC_URL;
  const indexerRpc = process.env.OG_INDEXER_RPC;
  const privateKey = process.env.OG_SERVER_PRIVATE_KEY;

  if (!rpcUrl || !indexerRpc || !privateKey) {
    throw new Error(
      "Missing 0G Storage env vars: NEXT_PUBLIC_0G_RPC_URL, OG_INDEXER_RPC, OG_SERVER_PRIVATE_KEY"
    );
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  return { signer, indexerRpc, rpcUrl };
}

// ─── Upload ───────────────────────────────────────────────────────────────────
/**
 * Upload a Buffer to 0G Storage.
 * Returns the Merkle root hash needed to retrieve the file later.
 */
export async function uploadToStorage(data: Buffer): Promise<UploadResult> {
  const { ZgFile, Indexer } = await getSdk();
  const { signer, indexerRpc, rpcUrl } = getStorageClients();

  // Write to a temp file (0G SDK works with file paths)
  const tmpPath = path.join(tmpdir(), `abobi-${Date.now()}.bin`);
  await writeFile(tmpPath, data);

  try {
    const file = await ZgFile.fromFilePath(tmpPath);
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);

    // Cast signer to bypass ESM/CJS ethers private class field mismatch
    // between ethers@6.16.0 (our version) and ethers@6.13.1 (SDK peer dep).
    // Runtime behavior is identical.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const indexer = new Indexer(indexerRpc);
    const [, uploadErr] = await indexer.upload(file, rpcUrl, signer as unknown as Parameters<typeof indexer.upload>[2]);
    if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);

    const rootHashValue = tree!.rootHash();
    if (!rootHashValue) throw new Error("Merkle tree produced null rootHash");

    return {
      rootHash: rootHashValue,
      size: data.length,
    };
  } finally {
    await unlink(tmpPath).catch(() => null);
  }
}

// ─── Download ─────────────────────────────────────────────────────────────────
/**
 * Download a file from 0G Storage by its Merkle root hash.
 */
export async function downloadFromStorage(rootHash: string): Promise<Buffer> {
  const { Indexer } = await getSdk();
  const { indexerRpc } = getStorageClients();

  const tmpPath = path.join(tmpdir(), `abobi-dl-${Date.now()}.bin`);

  try {
    const indexer = new Indexer(indexerRpc);
    const err = await indexer.download(rootHash, tmpPath, false);
    if (err) throw new Error(`Download error: ${err}`);

    return await readFile(tmpPath);
  } finally {
    await unlink(tmpPath).catch(() => null);
  }
}

// ─── History helpers ──────────────────────────────────────────────────────────
import type { ChatMessage } from "@/types/chat";

export async function uploadHistory(
  messages: ChatMessage[]
): Promise<UploadResult> {
  const jsonl = messages.map((m) => JSON.stringify(m)).join("\n");
  return uploadToStorage(Buffer.from(jsonl, "utf-8"));
}

export async function downloadHistory(
  rootHash: string
): Promise<ChatMessage[]> {
  const buf = await downloadFromStorage(rootHash);
  return buf
    .toString("utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ChatMessage);
}

// ─── Profile helpers ──────────────────────────────────────────────────────────
import type { UserProfile } from "@/types/user";

export async function uploadProfile(
  profile: UserProfile
): Promise<UploadResult> {
  return uploadToStorage(Buffer.from(JSON.stringify(profile), "utf-8"));
}

export async function downloadProfile(
  rootHash: string
): Promise<UserProfile> {
  const buf = await downloadFromStorage(rootHash);
  return JSON.parse(buf.toString("utf-8")) as UserProfile;
}
