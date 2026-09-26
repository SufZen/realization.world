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
    default: "Realization — Physical-World Venture Studio",
    template: "%s · Realization",
  },
  description: "A physical-world venture studio that identifies, builds and validates technology-enabled ventures around overlooked physical and spatial systems.",
  applicationName: "Realization",
  category: "Venture studio",
  keywords: [
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
    title: "Realization — Physical-World Venture Studio",
    description: "Realizing untapped potential in the physical world through venture architecture, technology and operating partnerships.",
    siteName: "Realization",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realization — Physical-World Venture Studio",
    description: "Realizing untapped potential in the physical world through venture architecture, technology and operating partnerships.",
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
              description: "Physical-world venture studio identifying, building and validating technology-enabled ventures around overlooked physical and spatial systems.",
              founder: { "@type": "Person", name: "Asaf Eyzenkot (Suf Zen)" },
              email: "hello@realization.world",
              areaServed: ["Europe", "Portugal", "Israel"],
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
