"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
import knowledgeBase from "@/data/knowledge-base.json";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
};

type LeadForm = {
  fullName: string;
  phoneNumber: string;
  course: string;
  city: string;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Bonjour 👋 Je suis l'assistant d'Atlas Digital Academy.\nPosez-moi une question sur les formations, horaires, inscription ou prix.",
  },
];

const emptyLeadForm: LeadForm = {
  fullName: "",
  phoneNumber: "",
  course: "",
  city: "",
};

const suggestedQuestions = [
  "Quels sont les cours disponibles ?",
  "شحال الثمن؟",
  "فين كاين المركز؟",
  "Comment s'inscrire ?",
  "واش كاين cours online ?",
];

function formatTime() {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [leadOriginalMessage, setLeadOriginalMessage] = useState("");
  const [leadForm, setLeadForm] = useState<LeadForm>(emptyLeadForm);
  const [leadStatus, setLeadStatus] = useState("");
  const [isSavingLead, setIsSavingLead] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatHistory = useMemo(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, leadOriginalMessage, leadStatus]);

  async function sendChatMessage(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    setLeadStatus("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: chatHistory }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const data = (await response.json()) as {
        reply: string;
        mode: string;
        leadIntent: boolean;
      };

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          mode: data.mode,
        },
      ]);

      if (data.leadIntent) {
        setLeadOriginalMessage(trimmed);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Je n'arrive pas à répondre maintenant. Un conseiller peut vous recontacter si vous laissez vos coordonnées.",
        },
      ]);
      setLeadOriginalMessage(trimmed);
    } finally {
      setIsSending(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendChatMessage(input);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingLead(true);
    setLeadStatus("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadForm, originalMessage: leadOriginalMessage }),
      });

      if (!response.ok) throw new Error("Lead save failed");

      const data = (await response.json()) as { storage: string };
      setLeadStatus(
        data.storage === "google-sheets"
          ? "Merci ! Vos informations ont été envoyées à notre équipe. On vous contacte bientôt 🎉"
          : "Merci ! Vos informations sont bien enregistrées. On vous contacte bientôt 🎉",
      );
      setLeadForm(emptyLeadForm);
      setLeadOriginalMessage("");
    } catch {
      setLeadStatus(
        "Impossible d'enregistrer maintenant. Vous pouvez appeler le +212 6 00 00 00 00.",
      );
    } finally {
      setIsSavingLead(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-57px)] max-w-4xl flex-col px-0 sm:px-4">
      <div className="flex-1 overflow-hidden bg-[#e8ede9] sm:py-4">
        <div
          className="mx-auto flex h-[calc(100vh-57px)] max-w-3xl flex-col bg-[#ece5dd] sm:h-[calc(100vh-89px)] sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-soft"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ece5dd'/%3E%3C/svg%3E\")",
          }}
        >
          {/* ── Chat header ── */}
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 sm:rounded-t-2xl">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-atlas-green text-sm font-bold text-white ring-2 ring-white/20">
                <Sparkles size={16} aria-hidden="true" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075e54] bg-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Atlas Digital Academy</p>
              <p className="text-xs text-emerald-200">Assistant IA · en ligne</p>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  dir="auto"
                  className={`max-w-[86%] whitespace-pre-line rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[74%] ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-[#dcf8c6] text-slate-800"
                      : "rounded-tl-sm bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                  <span className="mt-1 block text-right text-[10px] text-slate-400">
                    {formatTime()}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-xl rounded-tl-sm bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            {/* ── Lead form ── */}
            {leadOriginalMessage && (
              <div className="flex justify-end">
                <form
                  onSubmit={submitLead}
                  className="w-full max-w-sm rounded-2xl rounded-tr-sm border border-atlas-green/20 bg-white p-4 shadow-sm"
                >
                  <p className="font-semibold text-atlas-ink">
                    📋 Laissez vos coordonnées
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    On vous rappelle dans les plus brefs délais.
                  </p>
                  <div className="mt-3 grid gap-2.5">
                    <input
                      required
                      value={leadForm.fullName}
                      onChange={(e) =>
                        setLeadForm((c) => ({ ...c, fullName: e.target.value }))
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-atlas-green focus:bg-white focus:ring-2 focus:ring-atlas-green/15"
                      placeholder="Nom complet"
                    />
                    <input
                      required
                      value={leadForm.phoneNumber}
                      onChange={(e) =>
                        setLeadForm((c) => ({ ...c, phoneNumber: e.target.value }))
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-atlas-green focus:bg-white focus:ring-2 focus:ring-atlas-green/15"
                      placeholder="Téléphone (+212...)"
                    />
                    <select
                      required
                      value={leadForm.course}
                      onChange={(e) =>
                        setLeadForm((c) => ({ ...c, course: e.target.value }))
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-atlas-green focus:bg-white focus:ring-2 focus:ring-atlas-green/15"
                    >
                      <option value="">Formation souhaitée</option>
                      {knowledgeBase.courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                    <input
                      required
                      value={leadForm.city}
                      onChange={(e) =>
                        setLeadForm((c) => ({ ...c, city: e.target.value }))
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-atlas-green focus:bg-white focus:ring-2 focus:ring-atlas-green/15"
                      placeholder="Ville"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingLead}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingLead ? (
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    ) : (
                      <CheckCircle2 size={16} aria-hidden="true" />
                    )}
                    Envoyer mes informations
                  </button>
                </form>
              </div>
            )}

            {leadStatus && (
              <div className="flex justify-end">
                <div className="max-w-sm rounded-2xl rounded-tr-sm bg-atlas-green px-4 py-3 text-sm font-medium text-white shadow-sm">
                  {leadStatus}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Quick questions ── */}
          <div className="border-t border-black/10 bg-white/80 px-3 pt-2 pb-1 backdrop-blur-sm">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Questions fréquentes
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  dir="auto"
                  disabled={isSending}
                  onClick={() => sendChatMessage(question)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-atlas-green hover:text-atlas-green disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* ── Input ── */}
          <form
            onSubmit={sendMessage}
            className="flex items-end gap-2 border-t border-black/10 bg-[#f0f2f0] px-3 py-2 sm:rounded-b-2xl"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-atlas-green focus:ring-2 focus:ring-atlas-green/15"
              placeholder="Écrivez un message..."
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-atlas-green text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Envoyer"
            >
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
