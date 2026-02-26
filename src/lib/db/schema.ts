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
