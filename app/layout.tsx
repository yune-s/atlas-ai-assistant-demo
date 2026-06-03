import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistant IA · Centres de Formation au Maroc",
  description:
    "Répondez automatiquement aux questions des étudiants, collectez les demandes d'inscription et organisez vos leads en temps réel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
