import path from "path";
import fs from "fs";
import type Database from "better-sqlite3";
import { SCHEMA_SQL, type StorageIndexRow, type DocumentRow, type LawyerRow } from "./schema";
import type { StorageIndex, UserDocument } from "@/types/storage";
import type { Lawyer, LawyerApplication } from "@/types/lawyer";

// ─── Lazy singleton ───────────────────────────────────────────────────────────
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  // On Vercel (and other serverless platforms), only /tmp is writable.
  // Locally, default to ./data/abobi.db relative to cwd.
  const defaultPath = process.env.VERCEL ? "/tmp/abobi.db" : "./data/abobi.db";
  const dbPath = process.env.DATABASE_PATH ?? defaultPath;
  const absPath = dbPath.startsWith("/") ? dbPath : path.resolve(process.cwd(), dbPath);

  // Ensure directory exists
  fs.mkdirSync(path.dirname(absPath), { recursive: true });

  // Dynamic require avoids Next.js bundling the native module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const BetterSqlite3 = require("better-sqlite3") as typeof Database;
  _db = new BetterSqlite3(absPath);

  // WAL mode for better concurrent read performance
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  // Run migrations
  _db.exec(SCHEMA_SQL);

  return _db;
}

// ─── Row → domain type mapper ─────────────────────────────────────────────────
function rowToIndex(row: StorageIndexRow): StorageIndex {
  return {
    walletAddress: row.wallet_address,
    historyRootHash: row.history_root_hash,
    profileRootHash: row.profile_root_hash,
    updatedAt: row.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────
export function getStorageIndex(walletAddress: string): StorageIndex | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM storage_index WHERE wallet_address = ?")
    .get(walletAddress) as StorageIndexRow | undefined;
  return row ? rowToIndex(row) : null;
}

export function upsertStorageIndex(
  walletAddress: string,
  historyRootHash: string | null,
  profileRootHash: string | null
): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO storage_index (wallet_address, history_root_hash, profile_root_hash, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(wallet_address) DO UPDATE SET
       history_root_hash = excluded.history_root_hash,
       profile_root_hash = excluded.profile_root_hash,
       updated_at        = excluded.updated_at`
  ).run(walletAddress, historyRootHash, profileRootHash, Date.now());
}

// ─── Document helpers ─────────────────────────────────────────────────────────
function rowToDocument(row: DocumentRow): UserDocument {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    name: row.name,
    size: row.size,
    mimeType: row.mime_type,
    rootHash: row.root_hash,
    uploadedAt: row.uploaded_at,
    verified: row.verified === 1,
  };
}

export function insertDocument(doc: UserDocument): void {
  const db = getDb();
  db.prepare(
    `INSERT OR IGNORE INTO documents
       (id, wallet_address, name, size, mime_type, root_hash, uploaded_at, verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    doc.id,
    doc.walletAddress,
    doc.name,
    doc.size,
    doc.mimeType,
    doc.rootHash,
    doc.uploadedAt,
    doc.verified ? 1 : 0
  );
}

export function getDocuments(walletAddress: string): UserDocument[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM documents WHERE wallet_address = ? ORDER BY uploaded_at DESC")
    .all(walletAddress) as DocumentRow[];
  return rows.map(rowToDocument);
}

export function deleteDocument(id: string, walletAddress: string): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM documents WHERE id = ? AND wallet_address = ?")
    .run(id, walletAddress);
  return (result.changes ?? 0) > 0;
}

// ─── Lawyer helpers ───────────────────────────────────────────────────────────
function rowToLawyer(row: LawyerRow): Lawyer {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    fullName: row.full_name,
    email: row.email,
    barNumber: row.bar_number,
    jurisdiction: row.jurisdiction,
    specializations: JSON.parse(row.specializations) as string[],
    yearsExperience: row.years_experience,
    languages: JSON.parse(row.languages) as string[],
    bio: row.bio,
    website: row.website,
    status: row.status,
    appliedAt: row.applied_at,
    verifiedAt: row.verified_at,
    rejectionReason: row.rejection_reason,
  };
}

export function upsertLawyerApplication(app: LawyerApplication & { id: string }): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO lawyers
       (id, wallet_address, full_name, email, bar_number, jurisdiction,
        specializations, years_experience, languages, bio, website, applied_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(wallet_address) DO UPDATE SET
       full_name        = excluded.full_name,
       email            = excluded.email,
       bar_number       = excluded.bar_number,
       jurisdiction     = excluded.jurisdiction,
       specializations  = excluded.specializations,
       years_experience = excluded.years_experience,
       languages        = excluded.languages,
       bio              = excluded.bio,
       website          = excluded.website,
       status           = 'pending',
       applied_at       = excluded.applied_at,
       verified_at      = NULL,
       rejection_reason = NULL`
  ).run(
    app.id,
    app.walletAddress,
    app.fullName,
    app.email,
    app.barNumber,
    app.jurisdiction,
    JSON.stringify(app.specializations),
    app.yearsExperience,
    JSON.stringify(app.languages),
    app.bio,
    app.website ?? "",
    Date.now()
  );
}

export function getLawyerByWallet(walletAddress: string): Lawyer | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM lawyers WHERE wallet_address = ?")
    .get(walletAddress) as LawyerRow | undefined;
  return row ? rowToLawyer(row) : null;
}

export function getLawyerById(id: string): Lawyer | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM lawyers WHERE id = ?")
    .get(id) as LawyerRow | undefined;
  return row ? rowToLawyer(row) : null;
}

export function getVerifiedLawyers(): Lawyer[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM lawyers WHERE status = 'verified' ORDER BY full_name ASC")
    .all() as LawyerRow[];
  return rows.map(rowToLawyer);
}

export function getAllLawyerApplications(): Lawyer[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM lawyers ORDER BY applied_at DESC")
    .all() as LawyerRow[];
  return rows.map(rowToLawyer);
}

export function verifyLawyer(id: string): boolean {
  const db = getDb();
  const result = db
    .prepare("UPDATE lawyers SET status = 'verified', verified_at = ?, rejection_reason = NULL WHERE id = ?")
    .run(Date.now(), id);
  return (result.changes ?? 0) > 0;
}

export function rejectLawyer(id: string, reason: string): boolean {
  const db = getDb();
  const result = db
    .prepare("UPDATE lawyers SET status = 'rejected', rejection_reason = ?, verified_at = NULL WHERE id = ?")
    .run(reason, id);
  return (result.changes ?? 0) > 0;
}
