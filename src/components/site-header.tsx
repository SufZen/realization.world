"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNavigation } from "@/content/site";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.slice(0, 5).map((item) => (
            <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link className="header-opportunity" href="/bring-an-opportunity">
            Bring an opportunity
          </Link>
          <button
            className="menu-trigger"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <Menu size={17} aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="menu-overlay__scrim" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />
        <nav id="site-menu" className="menu-panel" aria-label="Site menu">
          <div className="menu-panel__head">
            <BrandMark inverse />
            <button className="menu-close" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="menu-panel__links">
            <Link className={pathname === "/" ? "is-active" : ""} href="/" onClick={() => setOpen(false)}>
              <span>Home</span><ArrowUpRight aria-hidden="true" />
            </Link>
            {primaryNavigation.map((item) => (
              <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href} onClick={() => setOpen(false)}>
                <span>{item.label}</span><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="menu-panel__foot">
            <p>Founder-led vision and validation.<br />Partner-operated scale and continuity.</p>
            <Link href="/bring-an-opportunity" onClick={() => setOpen(false)}>Start with an opportunity <ArrowUpRight aria-hidden="true" size={16} /></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
