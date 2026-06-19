import { promises as fs } from "fs";
import path from "path";
import { sendLeadNotification } from "@/lib/email-notification";
import { appendLeadToGoogleSheets, isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { buildLeadAutomation, normalizeLead } from "@/lib/lead-automation";
import type { Lead, LeadInput, LeadStorageTarget } from "@/types/lead";

const leadsFile = path.join(process.cwd(), "data", "leads.json");

async function ensureLocalStore() {
  await fs.mkdir(path.dirname(leadsFile), { recursive: true });

  try {
    await fs.access(leadsFile);
  } catch {
    await fs.writeFile(leadsFile, "[]", "utf8");
  }
}

export async function readLocalLeads(): Promise<Lead[]> {
  await ensureLocalStore();

  const raw = await fs.readFile(leadsFile, "utf8");

  try {
    return (JSON.parse(raw) as Lead[]).map(normalizeLead);
  } catch {
    return [];
  }
}

async function appendLeadToLocalJson(lead: Lead) {
  const leads = await readLocalLeads();
  leads.unshift(lead);
  await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), "utf8");
}

export async function saveLead(input: LeadInput): Promise<{
  lead: Lead;
  storage: LeadStorageTarget;
}> {
  const automation = buildLeadAutomation(input);
  const lead: Lead = {
    ...input,
    ...automation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // Google Sheets is the production path; local JSON keeps demos working without credentials.
  if (isGoogleSheetsConfigured()) {
    try {
      await appendLeadToGoogleSheets(lead);
      await sendLeadNotification(lead);
      return { lead, storage: "google-sheets" };
    } catch (error) {
      console.error("Google Sheets save failed. Falling back to local JSON.", error);
    }
  }

  await appendLeadToLocalJson(lead);
  await sendLeadNotification(lead);
  return { lead, storage: "local-json" };
}
