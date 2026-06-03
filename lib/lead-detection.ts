const pricingKeywords = [
  "price",
  "pricing",
  "cost",
  "costs",
  "fee",
  "fees",
  "how much",
  "tarif",
  "tarifs",
  "prix",
  "combien",
  "coute",
  "cout",
  "coûte",
  "coût",
  "chhal",
  "ch7al",
  "chkoun taman",
  "taman",
  "ثمن",
  "السعر",
  "سعر",
];

const registrationKeywords = [
  "register",
  "registration",
  "enroll",
  "join",
  "apply",
  "interested",
  "inscription",
  "inscrire",
  "interesse",
  "intéressé",
  "interessee",
  "intéressée",
  "m'inscrire",
  "s'inscrire",
  "signup",
  "sign up",
  "bghit",
  "bgha",
  "baghi",
  "bagha",
  "nsjel",
  "ntsajal",
  "nsejel",
  "تسجيل",
  "أسجل",
  "نسجل",
  "سجل",
];

const contactKeywords = [
  "contact",
  "conseiller",
  "advisor",
  "human",
  "appeler",
  "rappeler",
  "call me",
  "contact me",
  "appointment",
  "rendez-vous",
  "rdv",
  "بغيت نهضر",
  "بغيت نتاصل",
  "مستشار",
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function detectLeadIntent(message: string) {
  const normalized = normalizeText(message);

  return [
    ...pricingKeywords,
    ...registrationKeywords,
    ...contactKeywords,
  ].some((keyword) => normalized.includes(normalizeText(keyword)));
}
