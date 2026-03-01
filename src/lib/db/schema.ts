export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS storage_index (
    wallet_address    TEXT PRIMARY KEY,
    history_root_hash TEXT,
    profile_root_hash TEXT,
    updated_at        INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS documents (
    id             TEXT PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    name           TEXT NOT NULL,
    size           INTEGER NOT NULL,
    mime_type      TEXT NOT NULL DEFAULT 'application/octet-stream',
    root_hash      TEXT NOT NULL UNIQUE,
    uploaded_at    INTEGER NOT NULL,
    verified       INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_documents_wallet ON documents(wallet_address);

  CREATE TABLE IF NOT EXISTS lawyers (
    id                TEXT PRIMARY KEY,
    wallet_address    TEXT NOT NULL UNIQUE,
    full_name         TEXT NOT NULL,
    email             TEXT NOT NULL,
    bar_number        TEXT NOT NULL,
    jurisdiction      TEXT NOT NULL,
    specializations   TEXT NOT NULL DEFAULT '[]',
    years_experience  INTEGER NOT NULL DEFAULT 0,
    languages         TEXT NOT NULL DEFAULT '["English"]',
    bio               TEXT NOT NULL DEFAULT '',
    website           TEXT NOT NULL DEFAULT '',
    status            TEXT NOT NULL DEFAULT 'pending',
    applied_at        INTEGER NOT NULL,
    verified_at       INTEGER,
    rejection_reason  TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_lawyers_wallet ON lawyers(wallet_address);
  CREATE INDEX IF NOT EXISTS idx_lawyers_status ON lawyers(status);
`;

export interface StorageIndexRow {
  wallet_address: string;
  history_root_hash: string | null;
  profile_root_hash: string | null;
  updated_at: number;
}

export interface DocumentRow {
  id: string;
  wallet_address: string;
  name: string;
  size: number;
  mime_type: string;
  root_hash: string;
  uploaded_at: number;
  verified: number; // SQLite stores booleans as 0/1
}

export interface LawyerRow {
  id: string;
  wallet_address: string;
  full_name: string;
  email: string;
  bar_number: string;
  jurisdiction: string;
  specializations: string; // JSON array
  years_experience: number;
  languages: string; // JSON array
  bio: string;
  website: string;
  status: "pending" | "verified" | "rejected";
  applied_at: number;
  verified_at: number | null;
  rejection_reason: string | null;
}
