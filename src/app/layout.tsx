import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import SocialDock from "@/components/SocialDock";
import Footer from "@/components/Footer";
import ArtworkJsonLd from "@/components/ArtworkJsonLd";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "600"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaluki – Hyper‑realistic Pencil & Charcoal Art",
  description: "African pencil artist. Hyper‑realistic graphite & charcoal drawings. Explore the gallery and studio diary of Kaluki.",
  openGraph: {
    title: "Kaluki – Pencil & Charcoal Art",
    description: "Hyper‑realistic African portraits and still lifes rendered in graphite.",
    type: "website",
    locale: "en_KE",
    siteName: "Kaluki",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaluki – Pencil & Charcoal Art",
    description: "Hyper‑realistic African portraits and still lifes rendered in graphite.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${cormorantGaramond.variable} antialiased bg-bone text-charcoal font-sans`}
      >
        <ArtworkJsonLd />
        <Navigation />
        <main>{children}</main>
        <SocialDock />
        <Footer />
      </body>
    </html>
  );
}
