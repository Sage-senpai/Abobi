export interface StorageIndex {
  walletAddress: string;
  historyRootHash: string | null;
  profileRootHash: string | null;
  updatedAt: number; // Unix ms
}

export interface UploadResult {
  rootHash: string;
  size: number;
}
