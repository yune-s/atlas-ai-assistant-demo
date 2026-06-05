import { isGoogleSheetsConfigured, readLeadsFromGoogleSheets } from "@/lib/google-sheets";
import { readLocalLeads } from "@/lib/lead-storage";
import type { Lead } from "@/types/lead";

export type AdminLeadSource = "google-sheets" | "local-json";

export type AdminLeadResult = {
  leads: Lead[];
  source: AdminLeadSource;
  error?: string;
};

export async function getAdminLeads(): Promise<AdminLeadResult> {
  if (isGoogleSheetsConfigured()) {
    console.log("[admin] Fetching leads from Google Sheets.");

    try {
      return {
        leads: await readLeadsFromGoogleSheets(),
        source: "google-sheets",
      };
    } catch (error) {
      console.error("[admin] Google Sheets lead fetch failed.", error);

      return {
        leads: [],
        source: "google-sheets",
        error:
          "Impossible de charger les leads depuis Google Sheets pour le moment.",
      };
    }
  }

  console.log("[admin] Google Sheets env vars missing. Fetching leads from local JSON fallback.");

  return {
    leads: await readLocalLeads(),
    source: "local-json",
  };
}
