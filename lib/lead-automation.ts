import type { Lead, LeadInput, LeadPriority, LeadStatus } from "@/types/lead";

const priceKeywords = [
  "price",
  "prices",
  "pricing",
  "cost",
  "fee",
  "fees",
  "tarif",
  "tarifs",
  "prix",
  "combien",
  "coute",
  "coûte",
  "chhal",
  "ch7al",
  "taman",
  "thaman",
  "ثمن",
  "الثمن",
  "السعر",
  "شحال",
  "بشحال",
  "ø´ø­ø§ù",
  "ø§ù„ø«ù…ù†",
];

const registrationKeywords = [
  "register",
  "registration",
  "enroll",
  "enrol",
  "signup",
  "sign up",
  "inscription",
  "inscrire",
  "m'inscrire",
  "minscrire",
  "s'inscrire",
  "sinscrire",
  "تسجيل",
  "نسجل",
  "نتسجل",
  "بغيت نسجل",
  "بغيت نتسجل",
  "ابغي نسجل",
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAnyKeyword(value: string, keywords: string[]) {
  const normalizedValue = normalizeText(value);
  return keywords.some((keyword) => normalizedValue.includes(normalizeText(keyword)));
}

export function hasPriceIntent(message: string) {
  return includesAnyKeyword(message, priceKeywords);
}

export function hasRegistrationIntent(message: string) {
  return includesAnyKeyword(message, registrationKeywords);
}

export function buildLeadAutomation(input: LeadInput): {
  status: LeadStatus;
  priority: LeadPriority;
  notes: string;
} {
  const hasPhone = Boolean(input.phoneNumber.trim());
  const hasCourse = Boolean(input.course.trim());
  const askedAboutPrice = hasPriceIntent(input.originalMessage);
  const askedAboutRegistration = hasRegistrationIntent(input.originalMessage);

  const priority: LeadPriority =
    (askedAboutPrice || askedAboutRegistration) && hasPhone && hasCourse
      ? "Hot"
      : hasCourse
        ? "Warm"
        : "Cold";

  const notes = buildLeadNotes({
    course: input.course.trim(),
    askedAboutPrice,
    askedAboutRegistration,
    priority,
  });

  return {
    status: "New",
    priority,
    notes,
  };
}

export function normalizeLead(lead: Lead): Lead {
  const automation = buildLeadAutomation(lead);

  return {
    ...lead,
    status: lead.status || automation.status,
    priority: isLeadPriority(lead.priority) ? lead.priority : automation.priority,
    notes: lead.notes || automation.notes,
  };
}

function buildLeadNotes({
  course,
  askedAboutPrice,
  askedAboutRegistration,
  priority,
}: {
  course: string;
  askedAboutPrice: boolean;
  askedAboutRegistration: boolean;
  priority: LeadPriority;
}) {
  const parts = [course ? `Interested in ${course}.` : "General inquiry."];

  if (askedAboutPrice) {
    parts.push("Asked about price.");
  }

  if (askedAboutRegistration) {
    parts.push("Asked about registration.");
  }

  if (priority === "Hot") {
    parts.push("Follow up quickly.");
  } else if (priority === "Warm") {
    parts.push("Needs follow-up.");
  } else {
    parts.push("Review message before follow-up.");
  }

  return parts.join(" ");
}

function isLeadPriority(value: unknown): value is LeadPriority {
  return value === "Hot" || value === "Warm" || value === "Cold";
}
