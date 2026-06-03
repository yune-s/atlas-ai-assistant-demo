import { NextResponse } from "next/server";
import { saveLead } from "@/lib/lead-storage";
import type { LeadInput } from "@/types/lead";

export const runtime = "nodejs";

const requiredFields: Array<keyof LeadInput> = [
  "fullName",
  "phoneNumber",
  "course",
  "city",
  "originalMessage",
];

function sanitizeLeadInput(body: Partial<Record<keyof LeadInput, unknown>>) {
  return requiredFields.reduce<Partial<LeadInput>>((lead, field) => {
    const value = body[field];
    lead[field] = typeof value === "string" ? value.trim() : "";
    return lead;
  }, {});
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<
      Record<keyof LeadInput, unknown>
    >;
    const leadInput = sanitizeLeadInput(body);

    const missingField = requiredFields.find((field) => !leadInput[field]);

    if (missingField) {
      return NextResponse.json(
        { error: `${missingField} is required.` },
        { status: 400 },
      );
    }

    const result = await saveLead(leadInput as LeadInput);

    return NextResponse.json({
      success: true,
      storage: result.storage,
      lead: result.lead,
    });
  } catch (error) {
    console.error("Lead route failed", error);

    return NextResponse.json(
      { error: "Unable to save lead." },
      { status: 500 },
    );
  }
}
