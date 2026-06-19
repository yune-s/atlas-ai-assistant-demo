export interface LeadInput {
  fullName: string;
  phoneNumber: string;
  course: string;
  city: string;
  originalMessage: string;
}

export type LeadStatus = "New";
export type LeadPriority = "Hot" | "Warm" | "Cold";

export interface Lead extends LeadInput {
  id: string;
  createdAt: string;
  status: LeadStatus;
  priority: LeadPriority;
  notes: string;
}

export type LeadStorageTarget = "google-sheets" | "local-json";
