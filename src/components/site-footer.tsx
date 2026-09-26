import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { primaryNavigation } from "@/content/site";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide site-footer__grid">
        <div className="site-footer__identity">
          <BrandMark />
          <p className="spaced-caps">PHYSICAL POTENTIAL. DIGITAL SYSTEMS. REALIZED VALUE.</p>
          <p>Realizing untapped potential in the physical world.</p>
        </div>
        <div className="site-footer__nav">
          <p className="eyebrow">Explore</p>
          {primaryNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </div>
        <div className="site-footer__nav">
          <p className="eyebrow">Work with us</p>
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
          <a href="mailto:hello@realization.world">hello@realization.world</a>
          <p>Israel ↔ Portugal · Spain research</p>
        </div>
      </div>
      <div className="container-wide site-footer__legal">
        <p>© {new Date().getFullYear()} Realization. All rights reserved.</p>
        <p>
          Strategic content only. Not legal, securities, trademark, tax, regulatory or SEO advice. Venture status and results are subject to verification.
        </p>
      </div>
    </footer>
  );
}
