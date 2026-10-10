import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { approachNavigation, bookingUrl, contactEmail, primaryNavigation, whatsappUrl } from "@/content/site";
import { BrandMark } from "./brand-mark";
import { Lines } from "./lines";
import { SocialLinks } from "./social-links";

/** Sister sites: cross-links that tie the Realization entity together for people and search engines. */
const networkLinks = [
  ["realization.pt · property resolution", "https://realization.pt"],
  ["realizeos.ai · AI operations system", "https://realizeos.ai"],
  ["realization.co.il · Israel", "https://realization.co.il"],
  ["MeetSum", "https://meetsum.realization.co.il"],
  ["BOA Architecture", "https://www.boaarc.com"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide site-footer__grid">
        <div className="site-footer__identity">
          <BrandMark />
          <p className="spaced-caps">PHYSICAL POTENTIAL. DIGITAL SYSTEMS. REALIZED VALUE.</p>
          <p><Lines text="Realizing untapped potential | in the physical world." /></p>
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
          <Link href="/services/delivery">Delivery and team setup</Link>
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
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <a href={whatsappUrl} rel="noopener" data-umami-event="whatsapp">WhatsApp</a>
          <a href={bookingUrl} rel="noopener" data-umami-event="book-intro">Book a 30-min intro</a>
          <a href="/asaf">Founder · Asaf Eyzenkot</a>
          <p>Israel · Portugal · Europe</p>
        </div>
      </div>
      <nav className="container-wide site-footer__network" aria-label="Realization network">
        <p className="eyebrow">Network</p>
        {networkLinks.map(([label, href]) => <a href={href} key={href} rel="noopener">{label}</a>)}
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
