export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS storage_index (
    wallet_address    TEXT PRIMARY KEY,
    history_root_hash TEXT,
    profile_root_hash TEXT,
    updated_at        INTEGER NOT NULL
  );
`;

export interface StorageIndexRow {
  wallet_address: string;
  history_root_hash: string | null;
  profile_root_hash: string | null;
  updated_at: number;
}
