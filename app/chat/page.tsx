import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { ChatWidget } from "@/components/ChatWidget";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#e8ede9]">
      <header className="border-b border-slate-200 bg-[#075e54]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Atlas Digital Academy</p>
            <p className="text-xs text-emerald-200">Assistant IA · Démo</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Tableau de bord"
          >
            <LayoutDashboard size={18} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <ChatWidget />
    </main>
  );
}
