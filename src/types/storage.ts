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

export interface UserDocument {
  id: string;
  walletAddress: string;
  name: string;
  size: number;       // bytes
  mimeType: string;
  rootHash: string;   // 0G Merkle root hash (retrieval key)
  uploadedAt: number; // Unix ms
  verified: boolean;
}
