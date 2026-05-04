export type CaseStatus =
  | "preparing"
  | "submitted"
  | "biometrics-scheduled"
  | "interview-scheduled"
  | "additional-info-requested"
  | "approved"
  | "rejected"
  | "appeal";

export const CASE_STATUSES: CaseStatus[] = [
  "preparing",
  "submitted",
  "biometrics-scheduled",
  "interview-scheduled",
  "additional-info-requested",
  "approved",
  "rejected",
  "appeal",
];

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  preparing: "Preparing documents",
  submitted: "Submitted",
  "biometrics-scheduled": "Biometrics scheduled",
  "interview-scheduled": "Interview scheduled",
  "additional-info-requested": "Additional info requested",
  approved: "Approved",
  rejected: "Rejected",
  appeal: "Appeal in progress",
};

export interface CaseEvent {
  id: string;
  timestamp: number;
  status: CaseStatus;
  note?: string;
}

export interface VisaCase {
  id: string;
  country: string;
  visaType: string;
  status: CaseStatus;
  filedAt: number | null;
  receiptNumber?: string;
  notes?: string;
  events: CaseEvent[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateCaseInput {
  country: string;
  visaType: string;
  status: CaseStatus;
  filedAt?: number | null;
  receiptNumber?: string;
  notes?: string;
}
