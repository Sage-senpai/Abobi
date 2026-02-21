import path from "path";
import fs from "fs";
import type Database from "better-sqlite3";
import { SCHEMA_SQL, type StorageIndexRow } from "./schema";
import type { StorageIndex } from "@/types/storage";

// ─── Lazy singleton ───────────────────────────────────────────────────────────
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = process.env.DATABASE_PATH ?? "./data/abobi.db";
  const absPath = path.resolve(process.cwd(), dbPath);

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
