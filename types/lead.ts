export interface LeadInput {
  fullName: string;
  phoneNumber: string;
  course: string;
  city: string;
  originalMessage: string;
}

export interface Lead extends LeadInput {
  id: string;
  createdAt: string;
}

export type LeadStorageTarget = "google-sheets" | "local-json";
