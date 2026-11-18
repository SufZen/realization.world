import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { approachNavigation, bookingUrl, contactEmail, primaryNavigation, whatsappUrl } from "@/content/site";
import { communities } from "@/content/social";
import { BrandMark } from "./brand-mark";
import { Lines } from "./lines";
import { SocialLinks } from "./social-links";

/** Realization's country sites: one company, a site per market. */
const countryLinks = [
  ["World", "realization.world", "/", "en"],
  ["Israel", "realization.co.il", "https://realization.co.il", "he"],
  ["Portugal", "realization.pt", "https://realization.pt", "pt"],
  ["Spain", "realization.es", "https://realization.es", "es"],
] as const;

/** Ventures we built and partners we work with: separate from the country sites. */
const ventureLinks = [
  ["fluii.pt · stuck properties", "https://fluii.pt"],
  ["realizeos.ai · AI operations system", "https://realizeos.ai"],
  ["MeetSum", "https://meetsum.realization.co.il"],
  ["BOA Architecture", "https://www.boaarc.com"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide site-footer__grid">
        <div className="site-footer__identity">
          <BrandMark onYellow />
          <p><Lines text="Untapped potential. | Realized." /></p>
          <SocialLinks />
        </div>
        <div className="site-footer__nav">
          <p className="eyebrow">Explore</p>
          {[...primaryNavigation, ...approachNavigation].map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          {/* Separate app behind Traefik: plain <a> so the browser does a full load. */}
          <a href="/livelab">Live Lab</a>
        </div>
        <div className="site-footer__nav">
          <p className="eyebrow">Work with us</p>
          <Link href="/services/real-estate">Real estate development</Link>
          <Link href="/services/ai-systems">AI and operations systems</Link>
          <Link href="/services/team-setup">Team and process setup</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/partners/opportunity-owners">Opportunity owners</Link>
          <Link href="/partners/operators">Operators</Link>
          <Link href="/partners/capital">Capital partners</Link>
          <Link href="/partners/corporate-public">Corporate & public</Link>
        </div>
        <div className="site-footer__contact">
          <p className="eyebrow">Start here</p>
          <Link className="footer-cta" href="/bring-an-opportunity">
            Bring an opportunity <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <a href={whatsappUrl} rel="noopener" data-umami-event="whatsapp">WhatsApp</a>
          <a href={bookingUrl} rel="noopener" data-umami-event="book-intro">Book a 20-min intro</a>
          <a href="/asaf">Founder · Asaf Eyzenkot</a>
          {communities.map((group) => (
            <a href={group.href} rel="noopener" data-umami-event="join-group" data-umami-event-group={group.lang} key={group.href}>
              {group.lang === "he" ? "Portugal business group (Hebrew)" : "Portugal business group (English)"}
            </a>
          ))}
        </div>
      </div>
      <nav className="container-wide site-footer__network" aria-label="Realization countries">
        <p className="eyebrow">Countries</p>
        {countryLinks.map(([country, domain, href, lang]) => (
          <a href={href} key={href} hrefLang={lang} rel={href.startsWith("http") ? "noopener" : undefined}>
            <strong>{country}</strong> · {domain}
          </a>
        ))}
      </nav>
      <nav className="container-wide site-footer__network site-footer__network--minor" aria-label="Ventures and partners">
        <p className="eyebrow">Ventures and partners</p>
        {ventureLinks.map(([label, href]) => <a href={href} key={href} rel="noopener">{label}</a>)}
      </nav>
      <div className="container-wide site-footer__legal">
        <p>© {new Date().getFullYear()} Realization Unipessoal LDA · <Link href="/privacy">Privacy</Link> · <Link href="/legal">Legal</Link></p>
        <p>
          <Lines text="Nothing on this site is an offer | of securities or investment advice." />
        </p>
      </div>
    </footer>
  );
}
