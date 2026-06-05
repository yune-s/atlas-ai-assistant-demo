import Link from "next/link";
import { ArrowLeft, BarChart3, Clock, GraduationCap, Sparkles, Users } from "lucide-react";
import { getAdminLeads } from "@/lib/admin-leads";
import type { Lead } from "@/types/lead";

export const dynamic = "force-dynamic";

function mostRequestedCourse(leads: Lead[]) {
  const counts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.course] = (acc[lead.course] || 0) + 1;
    return acc;
  }, {});
  const [course] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  return course || "—";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateShort(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminPage() {
  const { leads, source, error } = await getAdminLeads();
  const latestLead = leads[0];

  const stats = [
    {
      label: "Total leads",
      value: leads.length.toString(),
      helper: "Contacts collectés par le chatbot",
      icon: Users,
      color: "bg-emerald-50 text-atlas-green",
    },
    {
      label: "Dernier lead",
      value: latestLead ? latestLead.fullName : "Aucun encore",
      helper: latestLead
        ? `${latestLead.course} · ${formatDate(latestLead.createdAt)}`
        : "Testez le chatbot pour générer un lead",
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Formation la plus demandée",
      value: mostRequestedCourse(leads),
      helper: "D'après les leads collectés",
      icon: GraduationCap,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-atlas-green"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 font-semibold text-atlas-ink">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-atlas-green text-white">
                <Sparkles size={15} aria-hidden="true" />
              </span>
              <span className="text-[15px]">Tableau de bord</span>
            </div>
          </div>
          <Link
            href="/chat"
            className="rounded-lg bg-atlas-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Ouvrir la démo
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        {/* ── Page title ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-atlas-green">
            Suivi en temps réel
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-atlas-ink">Leads collectés</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Contacts reçus via le chatbot : formation demandée, coordonnées et date de la demande.
          </p>
        </div>

        {source === "google-sheets" && !error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-atlas-green/30 bg-atlas-mint px-4 py-3 text-sm text-atlas-ink">
            <BarChart3 size={16} className="mt-0.5 shrink-0 text-atlas-green" aria-hidden="true" />
            <span>
              <strong>Google Sheets connecté.</strong> Les nouveaux leads sont synchronisés automatiquement.
            </span>
          </div>
        )}

        {source === "local-json" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <BarChart3 size={16} className="mt-0.5 shrink-0 text-atlas-green" aria-hidden="true" />
            <span>
              Google Sheets n'est pas configuré. Le tableau affiche les leads du fallback local.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error} Vérifiez les variables d'environnement Google Sheets et l'accès du service account.
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${stat.color}`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1.5 break-words text-2xl font-extrabold text-atlas-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{stat.helper}</p>
              </div>
            );
          })}
        </div>

        {/* ── Leads table ── */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-atlas-ink">Liste des leads</h2>
            <span className="rounded-full bg-atlas-mint px-2.5 py-1 text-xs font-semibold text-atlas-green">
              {leads.length} contact{leads.length !== 1 ? "s" : ""}
            </span>
          </div>

          {leads.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={24} aria-hidden="true" />
              </div>
              <p className="font-semibold text-slate-600">
                {error ? "Leads indisponibles" : "Aucun lead pour le moment"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {error
                  ? "Le tableau se réaffichera dès que la connexion Google Sheets sera rétablie."
                  : "Testez le chatbot avec une question sur les prix ou l'inscription."}
              </p>
              {!error && (
                <Link
                  href="/chat"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-atlas-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Tester le chatbot
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Full name</th>
                      <th className="px-5 py-3 font-semibold">Phone number</th>
                      <th className="px-5 py-3 font-semibold">Course</th>
                      <th className="px-5 py-3 font-semibold">City</th>
                      <th className="px-5 py-3 font-semibold">Original message</th>
                      <th className="px-5 py-3 font-semibold">Date/time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-semibold text-atlas-ink">
                          {lead.fullName}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600">
                          {lead.phoneNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex rounded-full bg-atlas-mint px-2.5 py-0.5 text-xs font-semibold text-atlas-green">
                            {lead.course}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{lead.city}</td>
                        <td className="max-w-xs px-5 py-3.5 text-slate-600">
                          {lead.originalMessage || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">
                          {formatDateShort(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {leads.map((lead) => (
                  <div key={lead.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-atlas-ink">{lead.fullName}</p>
                        <p className="mt-0.5 font-mono text-sm text-slate-500">{lead.phoneNumber}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-atlas-mint px-2.5 py-0.5 text-xs font-semibold text-atlas-green">
                        {lead.course}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>{lead.city}</span>
                      <span>·</span>
                      <span>{formatDateShort(lead.createdAt)}</span>
                    </div>
                    {lead.originalMessage && (
                      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500 italic">
                        &ldquo;{lead.originalMessage}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
