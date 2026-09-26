import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Voyages — Groupe Kalao",
  description:
    "Voyages du Groupe Kalao à Bastos, Yaoundé : billets, séjours et formalités, sur devis.",
  metadataBase: new URL("https://travel.groupe-kalao.com"),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }, { url: "/favicon.png", sizes: "48x48", type: "image/png" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Voyages — Groupe Kalao",
    description: "Billets, séjours et formalités depuis Yaoundé.",
    images: ["/voyage.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
