"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { approachNavigation, bookingUrl, partnerNavigation, primaryNavigation } from "@/content/site";
import { BrandMark } from "./brand-mark";
import { SocialLinks } from "./social-links";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Menu as a modal: focus moves in on open, Tab stays inside, Escape closes, focus returns to the trigger.
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) triggerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The Hebrew webinar landing page and its thank-you page stay focused: logo only, no English navigation.
  if (pathname === "/webinar" || pathname.startsWith("/webinar/")) {
    return (
      <header className="site-header">
        <div className="site-header__inner">
          <BrandMark />
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <a className="header-book" href={bookingUrl} target="_blank" rel="noopener" data-umami-event="book-intro">
            Book intro
          </a>
          <Link className="header-opportunity" href="/bring-an-opportunity">
            Bring an opportunity
          </Link>
          <button
            ref={triggerRef}
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

      <div className={`menu-overlay ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open}>
        <button className="menu-overlay__scrim" type="button" aria-label="Close menu" tabIndex={-1} onClick={() => setOpen(false)} />
        <nav id="site-menu" ref={panelRef} className="menu-panel" aria-label="Site menu">
          <div className="menu-panel__head">
            <BrandMark inverse />
            <button ref={closeRef} className="menu-close" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
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
          <p className="menu-panel__group">Partner with us</p>
          <div className="menu-panel__links menu-panel__links--minor">
            {partnerNavigation.map((item) => (
              <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href} onClick={() => setOpen(false)}>
                <span>{item.label}</span><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <p className="menu-panel__group">Our approach</p>
          <div className="menu-panel__links menu-panel__links--minor">
            {approachNavigation.map((item) => (
              <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href} onClick={() => setOpen(false)}>
                <span>{item.label}</span><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="menu-panel__foot">
            <p>Founder-led vision and validation.<br />Partner-operated scale and continuity.</p>
            <Link href="/bring-an-opportunity" onClick={() => setOpen(false)}>Start with an opportunity <ArrowUpRight aria-hidden="true" size={16} /></Link>
            <a href={bookingUrl} target="_blank" rel="noopener" data-umami-event="book-intro">Book a 20-min intro <ArrowUpRight aria-hidden="true" size={16} /></a>
            <SocialLinks tone="dark" />
          </div>
        </nav>
      </div>
    </header>
  );
}
