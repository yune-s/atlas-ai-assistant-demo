import { google } from "googleapis";
import type { Lead } from "@/types/lead";

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
    range: `${sheetName}!A:F`,
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

  return {
    id: `google-sheets-${index}-${createdAt}`,
    fullName: String(row[0] || "").trim(),
    phoneNumber: String(row[1] || "").trim(),
    course: String(row[2] || "").trim(),
    city: String(row[3] || "").trim(),
    originalMessage: String(row[4] || "").trim(),
    createdAt,
  };
}

export async function readLeadsFromGoogleSheets(): Promise<Lead[]> {
  const sheets = getGoogleSheetsClient();
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${sheetName}!A:F`,
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row.length > 0 && !isHeaderRow(row))
    .map(rowToLead)
    .filter((lead) => lead.fullName || lead.phoneNumber || lead.course)
    .reverse();
}
