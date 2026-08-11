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
  title: "Fruitloop — Independent 360° Creative Agency",
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${anton.variable} ${bebas.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`;

  return (
    <html lang="en">
      <body className={fontVars}>
        <Grain />
        <Cursor />
        <Nav />
        <main id="top">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
