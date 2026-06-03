import { detectLeadIntent } from "@/lib/lead-detection";
import { getKnowledgeBase } from "@/lib/knowledge";

type Language = "fr" | "en" | "ar" | "darija";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const courseDescriptions: Record<string, Record<Language, string>> = {
  "Python for Beginners": {
    fr: "Cette formation est adaptée aux débutants qui veulent apprendre les bases de Python.",
    en: "This course is suitable for beginners who want to learn Python basics.",
    ar: "هاد التكوين مناسب للمبتدئين اللي بغاو يتعلمو أساسيات Python.",
    darija: "Had formation mzyana l debutants li bghaw yt3lmo les bases dyal Python.",
  },
  "Web Development": {
    fr: "Cette formation vous aide à apprendre les bases de la création de sites web.",
    en: "This course helps you learn the basics of building websites.",
    ar: "هاد التكوين كيعلمك أساسيات إنشاء المواقع.",
    darija: "Had formation kat3awnk t3lm les bases dyal creation dyal sites web.",
  },
  "Digital Marketing": {
    fr: "Cette formation couvre les bases du marketing digital et de la communication en ligne.",
    en: "This course covers digital marketing basics and online communication.",
    ar: "هاد التكوين كيغطي أساسيات التسويق الرقمي والتواصل عبر الإنترنت.",
    darija: "Had formation katkhdm 3la les bases dyal marketing digital w communication online.",
  },
  "Excel for Business": {
    fr: "Cette formation est utile pour organiser, analyser et présenter des données avec Excel.",
    en: "This course helps you organize, analyze, and present data with Excel.",
    ar: "هاد التكوين كيعلمك تنظم وتحلل وتقدم المعطيات باستعمال Excel.",
    darija: "Had formation kat3awnk tnadem, t7llel, w tpresenti data b Excel.",
  },
  "AI Tools for Students": {
    fr: "Cette formation présente des outils IA pratiques pour étudier, rechercher et gagner du temps.",
    en: "This course introduces practical AI tools for studying, research, and productivity.",
    ar: "هاد التكوين كيعرفك على أدوات الذكاء الاصطناعي المفيدة للدراسة والبحث.",
    darija: "Had formation kat3rfk 3la AI tools li kay3awno f study, research, w productivity.",
  },
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function containsAny(message: string, keywords: string[]) {
  const normalized = normalizeText(message);

  return keywords.some((keyword) =>
    normalized.includes(normalizeText(keyword)),
  );
}

function detectLanguage(message: string): Language {
  if (/[\u0600-\u06FF]/.test(message)) {
    return "ar";
  }

  if (
    containsAny(message, [
      "salam",
      "chhal",
      "ch7al",
      "bghit",
      "bgha",
      "baghi",
      "bagha",
      "wach",
      "nsjel",
      "ntsajal",
      "nsejel",
      "chno",
      "achno",
      "takwinat",
      "kayn",
      "fin",
    ])
  ) {
    return "darija";
  }

  if (
    containsAny(message, [
      "bonjour",
      "prix",
      "tarif",
      "formation",
      "formations",
      "cours",
      "disponible",
      "disponibles",
      "programme",
      "programmes",
      "quels",
      "quelles",
      "inscription",
      "adresse",
      "horaires",
      "localisation",
      "conseiller",
    ])
  ) {
    return "fr";
  }

  return "en";
}

function lastAssistantMessage(history: ChatMessage[] = []) {
  return [...history].reverse().find((message) => message.role === "assistant")
    ?.content;
}

function wantsCoursesContext(history: ChatMessage[] = []) {
  const lastAssistant = lastAssistantMessage(history) || "";

  return containsAny(lastAssistant, [
    "quelle formation",
    "which course",
    "شنو التكوين",
    "prix ou vous inscrire",
    "price or register",
    "الثمن ولا تسجل",
  ]);
}

function wantsPriceOrRegisterContext(history: ChatMessage[] = []) {
  const lastAssistant = lastAssistantMessage(history) || "";

  return containsAny(lastAssistant, [
    "prix ou vous inscrire",
    "price or register",
    "الثمن ولا تسجل",
    "connaître le prix",
    "want the price",
  ]);
}

function isShortContextReply(message: string) {
  return normalizeText(message).split(/\s+/).filter(Boolean).length <= 3;
}

function detectConversationLanguage(
  message: string,
  history: ChatMessage[] = [],
) {
  const lastAssistant = lastAssistantMessage(history);

  if (lastAssistant && isShortContextReply(message)) {
    return detectLanguage(lastAssistant);
  }

  return detectLanguage(message);
}

function listCourses() {
  return getKnowledgeBase().courses.map((course) => `- ${course}`).join("\n");
}

export function generateCoursesReply(message: string) {
  const language = detectLanguage(message);
  const courses = listCourses();

  if (language === "ar" || language === "darija") {
    return `التكوينات المتوفرة عندنا هي:\n${courses}\n\nشنو التكوين اللي مهتم به؟`;
  }

  if (language === "fr") {
    return `Nos formations disponibles sont :\n${courses}\n\nQuelle formation vous intéresse le plus ?`;
  }

  return `Available courses are:\n${courses}\n\nWhich course interests you most?`;
}

export function isCourseQuestion(message: string) {
  return containsAny(message, [
    "available courses",
    "what courses",
    "which courses",
    "courses do you offer",
    "courses",
    "programs",
    "training",
    "available programs",
    "programmes",
    "formations disponibles",
    "formation disponible",
    "cours disponibles",
    "cours disponible",
    "cours",
    "التكوينات",
    "تكوينات",
    "التكوين",
    "الدورات",
    "دورات",
    "الدورة",
    "شنو كاين",
    "شنو كاين من تكوينات",
    "شنو كاين من دورات",
    "اش كاين من تكوينات",
    "اشنو كاين من تكوينات",
    "chno kayn men takwinat",
    "chno kayn mn takwinat",
    "ach kayn men takwinat",
    "achno kayn men takwinat",
  ]);
}

function detectCourse(message: string) {
  const courseMatchers: Array<{ course: string; keywords: string[] }> = [
    {
      course: "Python for Beginners",
      keywords: ["python"],
    },
    {
      course: "Web Development",
      keywords: ["web development", "web", "development", "site web"],
    },
    {
      course: "Digital Marketing",
      keywords: ["digital marketing", "marketing"],
    },
    {
      course: "Excel for Business",
      keywords: ["excel"],
    },
    {
      course: "AI Tools for Students",
      keywords: ["ai", "ia", "artificial intelligence", "الذكاء الاصطناعي"],
    },
  ];

  return courseMatchers.find((matcher) => containsAny(message, matcher.keywords))
    ?.course;
}

function courseSelectionReply(course: string, language: Language) {
  const description = courseDescriptions[course]?.[language] || "";

  if (language === "ar" || language === "darija") {
    return `${course} متوفر عند Atlas Digital Academy. ${description}\n\nبغيتي تعرف الثمن ولا تسجل؟`;
  }

  if (language === "fr") {
    return `${course} est disponible chez Atlas Digital Academy. ${description}\n\nSouhaitez-vous connaître le prix ou vous inscrire ?`;
  }

  return `${course} is available at Atlas Digital Academy. ${description}\n\nWould you like to know the price or register?`;
}

function greetingReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "Salam 👋 ana assistant dyal Atlas Digital Academy. N9der n3awnk f التكوينات، الثمن، التسجيل، horaires, w localisation.";
  }

  if (language === "fr") {
    return "Bonjour 👋 Je suis l'assistant d'Atlas Digital Academy. Je peux vous aider avec les formations, les prix, les horaires, l'inscription ou la localisation.";
  }

  return "Hello 👋 I am the assistant for Atlas Digital Academy. I can help with courses, prices, schedules, registration, and location.";
}

function priceReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "الثمن كيتبدل حسب التكوين والعروض المتوفرة. خلي المعلومات ديالك وغادي يتاصل بك مستشار يعطيك الثمن بالضبط.";
  }

  if (language === "fr") {
    return "Les prix dépendent de la formation choisie et des offres disponibles. Laissez vos informations et un conseiller vous contactera avec le prix exact.";
  }

  return "Prices depend on the selected course and current offers. Please leave your details and an advisor will contact you with the exact price.";
}

function registrationReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "باش تسجل، خلي المعلومات ديالك وغادي يتاصل بك مستشار يكمل معاك الطلب.";
  }

  if (language === "fr") {
    return "Pour l'inscription, laissez vos informations et un conseiller vous contactera pour finaliser votre demande.";
  }

  return "To register, leave your details and an advisor will contact you to finalize your request.";
}

function locationReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "المركز كاين ف Maarif, Casablanca.\n\nبغيتي تعرف التكوينات اللي كاينة؟";
  }

  if (language === "fr") {
    return "Nous sommes situés à Maarif, Casablanca.\n\nVoulez-vous aussi connaître les formations disponibles ?";
  }

  return "We are located in Maarif, Casablanca.\n\nWould you also like to see the available courses?";
}

function hoursReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "كنفتحو من الاثنين للسبت، من 9 دالصباح حتى 6 دالعشية.";
  }

  if (language === "fr") {
    return "Nous sommes ouverts du lundi au samedi, de 9h00 à 18h00.";
  }

  return "We are open Monday to Saturday, from 9:00 to 18:00.";
}

function onlineReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "بعض التكوينات ممكن تكون online حسب البرنامج. خلي المعلومات ديالك وغادي يأكد لك المستشار الخيارات.";
  }

  if (language === "fr") {
    return "Certaines formations peuvent être disponibles en ligne selon le programme. Laissez vos informations et un conseiller vous confirmera les options.";
  }

  return "Some courses may be available online depending on the program. Leave your details and an advisor will confirm the options.";
}

function contactReply(language: Language) {
  const phone = getKnowledgeBase().phone;

  if (language === "ar" || language === "darija") {
    return `تقدر تتاصل بنا على ${phone}. وتقدر حتى تخلي المعلومات ديالك وغادي يتاصل بك مستشار.`;
  }

  if (language === "fr") {
    return `Vous pouvez nous contacter au ${phone}. Vous pouvez aussi laisser vos informations et un conseiller vous rappellera.`;
  }

  return `You can contact us at ${phone}. You can also leave your details and an advisor will call you back.`;
}

function unknownReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "ما عنديش هاد المعلومة دابا. نقدر نوصل الطلب ديالك لمستشار. عفاك خلي الاسم ورقم الهاتف.";
  }

  if (language === "fr") {
    return "Je n'ai pas cette information pour le moment. Je peux transmettre votre demande à un conseiller. Pouvez-vous laisser votre nom et numéro de téléphone ?";
  }

  return "I do not have that information right now. I can transfer your request to an advisor. Please leave your name and phone number.";
}

function noReply(language: Language) {
  if (language === "ar" || language === "darija") {
    return "مزيان. نقدر نعاونك حتى ف horaires، localisation، ولا التكوينات المتوفرة.";
  }

  if (language === "fr") {
    return "D'accord. Je peux aussi vous aider avec les horaires, la localisation ou les formations disponibles.";
  }

  return "No problem. I can also help with schedules, location, or available courses.";
}

export function generateStructuredReply(
  message: string,
  history: ChatMessage[] = [],
) {
  const language = detectConversationLanguage(message, history);
  const course = detectCourse(message);

  if (containsAny(message, ["oui", "yes", "اه", "نعم", "iyyeh", "ah"])) {
    if (wantsPriceOrRegisterContext(history) || wantsCoursesContext(history)) {
      if (language === "ar" || language === "darija") {
        return "بغيتي تعرف الثمن ولا تسجل؟";
      }

      if (language === "fr") {
        return "Voulez-vous connaître le prix ou vous inscrire ?";
      }

      return "Would you like to know the price or register?";
    }
  }

  if (containsAny(message, ["non", "no", "لا", "la"])) {
    return noReply(language);
  }

  if (
    containsAny(message, [
      "bonjour",
      "salam",
      "السلام عليكم",
      "hello",
      "hi",
      "salut",
    ])
  ) {
    return greetingReply(language);
  }

  if (detectLeadIntent(message)) {
    if (
      containsAny(message, [
        "inscription",
        "register",
        "signup",
        "je veux m'inscrire",
        "بغيت نسجل",
        "بغيت نتسجل",
        "التسجيل",
      ])
    ) {
      return registrationReply(language);
    }

    if (
      containsAny(message, [
        "contact",
        "conseiller",
        "advisor",
        "human",
        "appeler",
        "rappeler",
        "call me",
        "بغيت نهضر",
      ])
    ) {
      return contactReply(language);
    }

    return priceReply(language);
  }

  if (
    containsAny(message, [
      "online",
      "distance",
      "en ligne",
      "cours online",
      "واش كاين online",
      "عن بعد",
    ])
  ) {
    return onlineReply(language);
  }

  if (
    containsAny(message, [
      "location",
      "adresse",
      "localisation",
      "ou etes-vous",
      "où êtes-vous",
      "فين كاين",
      "فين المركز",
      "العنوان",
      "maarif",
    ])
  ) {
    return locationReply(language);
  }

  if (
    containsAny(message, [
      "horaires",
      "opening hours",
      "وقتاش",
      "شحال كتفتحو",
      "أوقات العمل",
      "hours",
      "open",
    ])
  ) {
    return hoursReply(language);
  }

  if (isCourseQuestion(message)) {
    return generateCoursesReply(message);
  }

  if (course) {
    return courseSelectionReply(course, language);
  }

  if (wantsCoursesContext(history) && course) {
    return courseSelectionReply(course, language);
  }

  return null;
}

export function generateFallbackReply(message: string, history: ChatMessage[] = []) {
  const language = detectConversationLanguage(message, history);

  return generateStructuredReply(message, history) || unknownReply(language);
}
