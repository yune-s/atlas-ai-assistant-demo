import { NextResponse } from "next/server";
import { isGoogleSheetsConfigured } from "@/lib/google-sheets";
import { readLocalLeads } from "@/lib/lead-storage";

export const runtime = "nodejs";

export async function GET() {
  const leads = await readLocalLeads();

  return NextResponse.json({
    leads,
    googleSheetsConfigured: isGoogleSheetsConfigured(),
  });
}
