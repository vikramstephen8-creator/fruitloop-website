import type { Metadata } from "next";
import { Anton, Bebas_Neue, Space_Grotesk, Space_Mono } from "next/font/google";
import { SITE } from "@/lib/data";
import "./globals.css";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-label" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Fruitloop — Independent 360° Creative Agency",
  description: SITE.description,
  openGraph: {
    title: "Fruitloop — Independent 360° Creative Agency",
    description: SITE.description,
    type: "website",
    // Branded card rendered by GET /api/og/home
    images: [{ url: "/api/og/home", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/home"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${anton.variable} ${bebas.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phones.map((p) => p.value),
    location: { "@type": "Place", name: SITE.location },
  };

  return (
    <html lang="en">
      <body className={fontVars}>
        <Grain />
        <Cursor />
        <Nav />
        <main id="top">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
