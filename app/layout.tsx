import type { Metadata } from "next";
import { Cormorant_Garamond, Syne, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const label = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-label",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jaegerlongevity.com"),
  title: {
    default: "Jaeger Longevity — Missions for a longer, sharper life",
    template: "%s — Jaeger Longevity",
  },
  description:
    "Finite, mission-based transformations across nutrition, training, and mental focus. Built for the long game.",
  openGraph: {
    title: "Jaeger Longevity",
    description:
      "Finite, mission-based transformations across nutrition, training, and mental focus.",
    url: "https://www.jaegerlongevity.com",
    siteName: "Jaeger Longevity",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Jaeger Longevity" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${label.variable} ${body.variable}`}
    >
      <body className="min-h-screen grain flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
