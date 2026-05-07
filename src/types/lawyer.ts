export type ServiceType =
  | "Lawyer"
  | "RCIC (Canada Consultant)"
  | "OISC Adviser (UK)"
  | "MARA Agent (Australia)"
  | "Translator"
  | "Credential Evaluator"
  | "Notary"
  | "Document Specialist";

export const SERVICE_TYPES: ServiceType[] = [
  "Lawyer",
  "RCIC (Canada Consultant)",
  "OISC Adviser (UK)",
  "MARA Agent (Australia)",
  "Translator",
  "Credential Evaluator",
  "Notary",
  "Document Specialist",
];

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
  serviceType: ServiceType;
  flatRateUSD?: number;
  hourlyRateUSD?: number;
  acceptsHires?: boolean;
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
  serviceType: ServiceType;
  flatRateUSD?: number;
  hourlyRateUSD?: number;
  acceptsHires?: boolean;
}
