import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/content/site";
import { founderSchema, graph, organizationSchema } from "@/lib/schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Only used by the RTL/Hebrew rules in globals.css; not preloaded until Hebrew pages exist.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "hebrew"],
  display: "swap",
  preload: false,
});

const description =
  "Realization develops real estate in Portugal and builds the ventures and AI systems around it — residential development, property resolution, and advisory on AI adoption and operations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Realization — Real estate, ventures and systems",
    template: "%s · Realization",
  },
  description,
  applicationName: "Realization",
  category: "Real estate",
  keywords: [
    "real estate development Portugal",
    "residential development Barreiro",
    "property resolution Portugal",
    "AI adoption consulting",
    "AI operations system",
    "RealizeOS",
    "Asaf Eyzenkot",
    "Suf Zen",
  ],
  authors: [{ name: "Asaf Eyzenkot", url: `${siteUrl}/asaf` }],
  creator: "Realization Unipessoal LDA",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Realization — Real estate, ventures and systems",
    description,
    siteName: "Realization",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realization — Real estate, ventures and systems",
    description,
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
        <JsonLd data={graph(organizationSchema, founderSchema)} />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
