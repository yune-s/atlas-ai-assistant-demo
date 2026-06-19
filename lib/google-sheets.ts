import { google } from "googleapis";
import { buildLeadAutomation } from "@/lib/lead-automation";
import type { Lead, LeadInput, LeadPriority } from "@/types/lead";

export function isGoogleSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
      process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  );
}

function getGoogleSheetsClient() {
  if (!isGoogleSheetsConfigured()) {
    throw new Error("Google Sheets credentials are not configured.");
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendLeadToGoogleSheets(lead: Lead) {
  const sheets = getGoogleSheetsClient();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${sheetName}!A:I`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          lead.fullName,
          lead.phoneNumber,
          lead.course,
          lead.city,
          lead.originalMessage,
          lead.createdAt,
          lead.status,
          lead.priority,
          lead.notes,
        ],
      ],
    },
  });
}

function isHeaderRow(row: unknown[]) {
  return String(row[0] || "")
    .trim()
    .toLowerCase()
    .includes("full");
}

function rowToLead(row: unknown[], index: number): Lead {
  const createdAt = String(row[5] || "").trim() || new Date().toISOString();
  const input: LeadInput = {
    fullName: String(row[0] || "").trim(),
    phoneNumber: String(row[1] || "").trim(),
    course: String(row[2] || "").trim(),
    city: String(row[3] || "").trim(),
    originalMessage: String(row[4] || "").trim(),
  };
  const automation = buildLeadAutomation(input);
  const priority = normalizePriority(row[7]) || automation.priority;

  return {
    id: `google-sheets-${index}-${createdAt}`,
    ...input,
    createdAt,
    status: String(row[6] || "").trim() === "New" ? "New" : automation.status,
    priority,
    notes: String(row[8] || "").trim() || automation.notes,
  };
}

export async function readLeadsFromGoogleSheets(): Promise<Lead[]> {
  const sheets = getGoogleSheetsClient();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${sheetName}!A:I`,
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row.length > 0 && !isHeaderRow(row))
    .map(rowToLead)
    .filter((lead) => lead.fullName || lead.phoneNumber || lead.course)
    .reverse();
}

function normalizePriority(value: unknown): LeadPriority | null {
  const priority = String(value || "").trim();
  return priority === "Hot" || priority === "Warm" || priority === "Cold"
    ? priority
    : null;
}
