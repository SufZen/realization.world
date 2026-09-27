import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/content/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Realization — Real estate, ventures and systems",
    template: "%s · Realization",
  },
  description: "Realization develops real estate in Portugal and builds the ventures and systems around it, with an Israeli capital and partnership network.",
  applicationName: "Realization",
  category: "Real estate",
  keywords: [
    "real estate development Portugal",
    "physical-world venture studio",
    "venture architecture",
    "physical-world systems",
    "venture validation",
    "Realization Portugal",
    "Israel Europe venture bridge",
    "RealizeOS",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Realization — Real estate, ventures and systems",
    description: "Realization develops real estate in Portugal and builds the ventures and systems around it, with an Israeli capital and partnership network.",
    siteName: "Realization",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realization — Real estate, ventures and systems",
    description: "Realization develops real estate in Portugal and builds the ventures and systems around it, with an Israeli capital and partnership network.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FDCC33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${openSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Realization",
              url: siteUrl,
              description: "Realization develops real estate in Portugal and builds the ventures and systems around it.",
              founder: { "@type": "Person", name: "Asaf Eyzenkot (Suf Zen)" },
              email: "hello@realization.world",
              areaServed: ["Portugal", "Spain", "Europe", "Israel"],
            }),
          }}
        />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
