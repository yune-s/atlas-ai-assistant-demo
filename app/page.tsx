import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  BookOpen,
  DollarSign,
  CalendarDays,
  UserCheck,
} from "lucide-react";

const benefits = [
  {
    title: "Réponses instantanées",
    description:
      "L'assistant répond aux questions fréquentes 24h/24, même quand votre équipe est occupée ou hors ligne.",
    icon: MessageCircle,
    color: "bg-emerald-50 text-atlas-green",
  },
  {
    title: "Plus d'inscriptions",
    description:
      "Chaque question sur les prix ou les formations peut devenir un contact qualifié à rappeler.",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Leads organisés",
    description:
      "Nom, téléphone, formation souhaitée, ville — tout est enregistré automatiquement en temps réel.",
    icon: BarChart3,
    color: "bg-violet-50 text-violet-600",
  },
];

const steps = [
  {
    num: "01",
    title: "L'étudiant pose une question",
    desc: "Via le chat intégré à votre site ou votre page de formations.",
  },
  {
    num: "02",
    title: "L'assistant répond automatiquement",
    desc: "En français, en arabe ou en darija — instantanément et sans intervention humaine.",
  },
  {
    num: "03",
    title: "Les informations sont collectées",
    desc: "Nom, téléphone, formation et ville sont capturés et sauvegardés.",
  },
  {
    num: "04",
    title: "Le centre fait le suivi",
    desc: "L'équipe consulte les leads depuis le tableau de bord et relance les contacts.",
  },
];

const useCases = [
  { icon: BookOpen, label: "Formations disponibles", example: "\"Quels cours proposez-vous ?\"" },
  { icon: DollarSign, label: "Prix & financement", example: "\"شحال الثمن؟\"" },
  { icon: CalendarDays, label: "Horaires & planning", example: "\"Quels sont les horaires ?\"" },
  { icon: MapPin, label: "Localisation", example: "\"فين كاين المركز؟\"" },
  { icon: UserCheck, label: "Inscription", example: "\"Comment s'inscrire ?\"" },
  { icon: Clock, label: "Durée des formations", example: "\"Combien de temps dure Excel ?\"" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5 font-semibold text-atlas-ink">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-atlas-green text-white shadow-sm">
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <span className="text-[15px]">Assistant IA Atlas</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-atlas-green sm:block"
            >
              Tableau leads
            </Link>
            <Link
              href="/chat"
              className="rounded-lg bg-atlas-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Tester la démo
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_0.9fr] md:items-center md:py-20">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-atlas-green/20 bg-atlas-mint px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-atlas-green">
            <span className="h-1.5 w-1.5 rounded-full bg-atlas-green animate-pulse" />
            Démo disponible maintenant
          </div>

          <h1 className="max-w-xl text-[2.6rem] font-extrabold leading-[1.12] tracking-tight text-atlas-ink md:text-5xl">
            Assistant IA pour centres de formation{" "}
            <span className="text-atlas-green">au Maroc</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Répondez automatiquement aux questions des étudiants, collectez
            les demandes d'inscription et organisez vos leads en temps réel.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              "Répond en français, arabe et darija",
              "Capture les leads automatiquement",
              "Tableau de bord en temps réel",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 size={16} className="shrink-0 text-atlas-green" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-atlas-green px-6 py-3.5 font-semibold text-white shadow-soft transition hover:bg-emerald-700 hover:shadow-md"
            >
              Tester la démo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="#comment"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-atlas-ink transition hover:border-atlas-green hover:text-atlas-green"
            >
              Voir comment ça marche
            </a>
          </div>
        </div>

        {/* ── Preview card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          {/* Chat header */}
          <div className="rounded-xl bg-[#075e54] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-atlas-green text-sm font-bold text-white ring-2 ring-white/30">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Atlas Digital Academy</p>
                <p className="text-xs text-emerald-200">Assistant IA en ligne</p>
              </div>
            </div>
          </div>

          {/* Chat body */}
          <div className="space-y-3 bg-[#e5ddd5] bg-opacity-30 px-3 py-4 rounded-b-xl" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E\")"}}>
            {/* Bot message */}
            <div className="flex justify-start">
              <div className="max-w-[84%] rounded-lg rounded-tl-none bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm">
                Bonjour 👋 Je suis l'assistant d'Atlas Digital Academy. Comment puis-je vous aider ?
                <span className="mt-1 block text-right text-[10px] text-slate-400">10:12</span>
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm">
                Quels sont les cours disponibles ?
                <span className="mt-1 block text-right text-[10px] text-slate-400">10:13</span>
              </div>
            </div>

            {/* Bot answer */}
            <div className="flex justify-start">
              <div className="max-w-[84%] rounded-lg rounded-tl-none bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm">
                Nos formations : Python, Web Dev, Digital Marketing, Excel et AI Tools.
                <span className="mt-1 block text-right text-[10px] text-slate-400">10:13</span>
              </div>
            </div>

            {/* User wants to register */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm">
                Je veux m'inscrire au cours Excel
                <span className="mt-1 block text-right text-[10px] text-slate-400">10:14</span>
              </div>
            </div>

            {/* Lead saved badge */}
            <div className="flex items-center gap-2 rounded-lg border border-atlas-green/20 bg-atlas-mint px-3 py-2.5 text-xs font-medium text-atlas-green">
              <CheckCircle2 size={14} aria-hidden="true" />
              Lead enregistré · Youssef M., Excel, Casablanca
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-atlas-green">Pourquoi Atlas IA</p>
            <h2 className="mt-2 text-3xl font-bold text-atlas-ink">
              Tout ce dont votre centre a besoin
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group rounded-2xl border border-slate-200 bg-[#f7f8f6] p-6 transition hover:border-atlas-green/30 hover:shadow-soft"
                >
                  <div className={`mb-5 grid h-12 w-12 place-items-center rounded-xl ${b.color}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-atlas-ink">{b.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="comment" className="py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-atlas-green">Processus</p>
            <h2 className="mt-2 text-3xl font-bold text-atlas-ink">Comment ça marche ?</h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-slate-600">
              Un parcours simple pour l'étudiant et facile à suivre pour votre équipe.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-4 -translate-y-1/2 translate-x-4 bg-slate-300 md:block" />
                )}
                <p className="text-3xl font-extrabold text-slate-100">{step.num}</p>
                <p className="mt-3 font-bold text-atlas-ink">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-atlas-green px-6 py-3.5 font-semibold text-white shadow-soft transition hover:bg-emerald-700"
            >
              Tester maintenant
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-atlas-green">Cas d'usage</p>
            <h2 className="mt-2 text-3xl font-bold text-atlas-ink">
              Questions gérées automatiquement
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.label}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#f7f8f6] p-5 transition hover:border-atlas-green/30"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-atlas-mint text-atlas-green">
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-atlas-ink">{uc.label}</p>
                    <p className="mt-1 text-sm italic text-slate-500">{uc.example}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <div className="rounded-2xl bg-atlas-green px-8 py-12 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">Prêt à commencer ?</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Prêt à tester l'assistant ?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-emerald-100 leading-relaxed">
              Essayez la démo en direct. Posez une question en français, en arabe ou en darija.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-atlas-green shadow transition hover:shadow-md"
              >
                Tester la démo
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Voir le tableau leads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
        <p>© 2025 Assistant IA Atlas · Démo pour centres de formation au Maroc</p>
      </footer>
    </main>
  );
}
