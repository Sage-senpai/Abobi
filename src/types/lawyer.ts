export interface Lawyer {
  id: string;
  walletAddress: string;
  fullName: string;
  email: string;
  barNumber: string;
  jurisdiction: string;
  specializations: string[];
  yearsExperience: number;
  languages: string[];
  bio: string;
  website: string;
  status: "pending" | "verified" | "rejected";
  appliedAt: number;
  verifiedAt: number | null;
  rejectionReason: string | null;
}

export interface LawyerApplication {
  walletAddress: string;
  fullName: string;
  email: string;
  barNumber: string;
  jurisdiction: string;
  specializations: string[];
  yearsExperience: number;
  languages: string[];
  bio: string;
  website?: string;
}
