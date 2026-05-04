/**
 * Data access layer — backed by 0G Storage + smart contracts (no SQLite).
 *
 * - StorageIndex contract: wallet → {historyRoot, profileRoot, documentsRoot}
 * - LawyerRegistry contract: wallet → status + metadataURI (0G root hash of profile JSON)
 * - 0G Storage: actual data (chat history, profiles, document metadata, lawyer metadata)
 *
 * All functions are async (contract reads + 0G downloads).
 */

import type { StorageIndex, UserDocument } from "@/types/storage";
import type { Lawyer, LawyerApplication } from "@/types/lawyer";
import {
  getRoots,
  updateRoots,
} from "@/lib/contracts/StorageIndex";
import {
  readOnChainRecord,
  getVerifiedAddresses,
  getAllApplicantAddresses,
  serverApplyOnBehalf,
  serverVerifyLawyer as contractVerifyLawyer,
  serverRejectLawyer as contractRejectLawyer,
  LawyerStatus,
} from "@/lib/contracts/LawyerRegistry";
import {
  uploadToStorage,
  downloadFromStorage,
} from "@/lib/0g/storage";

// ─── Storage Index (contract reads/writes) ──────────────────────────────────

export async function getStorageIndex(walletAddress: string): Promise<StorageIndex | null> {
  const roots = await getRoots(walletAddress);

  // All empty = no data stored yet
  if (!roots.historyRoot && !roots.profileRoot && !roots.documentsRoot) {
    return null;
  }

  return {
    walletAddress,
    historyRootHash: roots.historyRoot || null,
    profileRootHash: roots.profileRoot || null,
    updatedAt: Date.now(),
  };
}

export async function upsertStorageIndex(
  walletAddress: string,
  historyRootHash: string | null,
  profileRootHash: string | null,
): Promise<void> {
  await updateRoots(
    walletAddress,
    historyRootHash ?? "",
    profileRootHash ?? "",
    "", // leave documentsRoot unchanged
  );
}

// ─── Document helpers (0G Storage + contract) ───────────────────────────────

/**
 * Download the documents list JSON from 0G. Returns [] if no data yet.
 */
async function loadDocumentsList(walletAddress: string): Promise<UserDocument[]> {
  const roots = await getRoots(walletAddress);
  if (!roots.documentsRoot) return [];

  try {
    const buf = await downloadFromStorage(roots.documentsRoot);
    return JSON.parse(buf.toString("utf-8")) as UserDocument[];
  } catch {
    return [];
  }
}

/**
 * Upload the documents list JSON and update the contract.
 */
async function saveDocumentsList(walletAddress: string, docs: UserDocument[]): Promise<void> {
  const json = JSON.stringify(docs);
  const { rootHash } = await uploadToStorage(Buffer.from(json, "utf-8"));

  await updateRoots(walletAddress, "", "", rootHash);
}

export async function insertDocument(doc: UserDocument): Promise<void> {
  const docs = await loadDocumentsList(doc.walletAddress);
  docs.push(doc);
  await saveDocumentsList(doc.walletAddress, docs);
}

export async function getDocuments(walletAddress: string): Promise<UserDocument[]> {
  const docs = await loadDocumentsList(walletAddress);
  return docs.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export async function deleteDocument(id: string, walletAddress: string): Promise<boolean> {
  const docs = await loadDocumentsList(walletAddress);
  const idx = docs.findIndex((d) => d.id === id && d.walletAddress === walletAddress);
  if (idx === -1) return false;

  docs.splice(idx, 1);
  await saveDocumentsList(walletAddress, docs);
  return true;
}

// ─── Lawyer helpers (LawyerRegistry contract + 0G Storage) ──────────────────

/**
 * Download lawyer profile metadata from 0G Storage using the contract's metadataURI.
 */
async function loadLawyerMetadata(metadataURI: string): Promise<LawyerApplication | null> {
  if (!metadataURI) return null;
  try {
    const buf = await downloadFromStorage(metadataURI);
    return JSON.parse(buf.toString("utf-8")) as LawyerApplication;
  } catch {
    return null;
  }
}

/**
 * Build a Lawyer object from on-chain record + 0G metadata.
 */
async function buildLawyer(walletAddress: string): Promise<Lawyer | null> {
  const record = await readOnChainRecord(walletAddress);
  if (record.status === LawyerStatus.None) return null;

  const meta = await loadLawyerMetadata(record.metadataURI);

  const statusMap: Record<number, "pending" | "verified" | "rejected"> = {
    [LawyerStatus.Pending]: "pending",
    [LawyerStatus.Verified]: "verified",
    [LawyerStatus.Rejected]: "rejected",
  };

  return {
    id: walletAddress, // wallet is the canonical ID
    walletAddress,
    fullName: meta?.fullName ?? "",
    email: meta?.email ?? "",
    barNumber: meta?.barNumber ?? "",
    jurisdiction: meta?.jurisdiction ?? "",
    specializations: meta?.specializations ?? [],
    yearsExperience: meta?.yearsExperience ?? 0,
    languages: meta?.languages ?? [],
    bio: meta?.bio ?? "",
    website: meta?.website ?? "",
    serviceType: (meta?.serviceType as Lawyer["serviceType"]) ?? "Lawyer",
    status: statusMap[record.status] ?? "pending",
    appliedAt: record.appliedAt * 1000, // convert seconds → ms
    verifiedAt: record.verifiedAt ? record.verifiedAt * 1000 : null,
    rejectionReason: record.rejectionReason || null,
  };
}

export async function upsertLawyerApplication(
  app: LawyerApplication & { id: string },
): Promise<void> {
  // 1. Upload metadata JSON to 0G Storage
  const json = JSON.stringify({
    walletAddress: app.walletAddress,
    fullName: app.fullName,
    email: app.email,
    barNumber: app.barNumber,
    jurisdiction: app.jurisdiction,
    specializations: app.specializations,
    yearsExperience: app.yearsExperience,
    languages: app.languages,
    bio: app.bio,
    website: app.website ?? "",
    serviceType: app.serviceType ?? "Lawyer",
  });
  const { rootHash } = await uploadToStorage(Buffer.from(json, "utf-8"));

  // 2. Register on-chain via operator
  await serverApplyOnBehalf(app.walletAddress, rootHash);
}

export async function getLawyerByWallet(walletAddress: string): Promise<Lawyer | null> {
  return buildLawyer(walletAddress);
}

export async function getLawyerById(id: string): Promise<Lawyer | null> {
  // In V2, id === walletAddress
  return buildLawyer(id);
}

export async function getVerifiedLawyers(): Promise<Lawyer[]> {
  const addresses = await getVerifiedAddresses();
  const lawyers = await Promise.all(addresses.map(buildLawyer));
  return lawyers.filter((l): l is Lawyer => l !== null);
}

export async function getAllLawyerApplications(): Promise<Lawyer[]> {
  const addresses = await getAllApplicantAddresses();
  const lawyers = await Promise.all(addresses.map(buildLawyer));
  return lawyers.filter((l): l is Lawyer => l !== null);
}

export async function verifyLawyer(walletAddress: string): Promise<boolean> {
  try {
    await contractVerifyLawyer(walletAddress);
    return true;
  } catch {
    return false;
  }
}

export async function rejectLawyer(walletAddress: string, reason: string): Promise<boolean> {
  try {
    await contractRejectLawyer(walletAddress, reason);
    return true;
  } catch {
    return false;
  }
}
