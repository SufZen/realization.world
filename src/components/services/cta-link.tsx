"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink } from "@/components/button-link";
import type { Cta } from "@/content/services";
import { trackingFor } from "@/lib/tracking";

type CtaLinkProps = {
  cta: Cta;
  /** The page's own ref, used when the visitor arrived without one. */
  pageRef: string;
  variant?: "primary" | "dark" | "light" | "outline" | "text";
};

/** A ref is a short slug, as in the brief and webinar forms. */
const cleanRef = (value: string | null) => (value ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 80);

function withRef(href: string, ref: string) {
  const [base, hash = ""] = href.split("#");
  const [path, query = ""] = base.split("?");
  const params = new URLSearchParams(query);
  params.set("ref", ref);
  return `${path}?${params}${hash ? `#${hash}` : ""}`;
}

function linkFor(cta: Cta, ref: string) {
  const href = cta.carryRef ? withRef(cta.href, ref) : cta.href;
  const tracking: Record<string, string> = cta.event
    ? { "data-umami-event": cta.event, ...Object.fromEntries(Object.entries(cta.data ?? {}).map(([key, value]) => [`data-umami-event-${key}`, value])) }
    : trackingFor(cta.href);
  if (tracking["data-umami-event"]) tracking["data-umami-event-ref"] = ref;
  return { href, tracking };
}

function CarriedLink({ cta, pageRef, variant }: CtaLinkProps) {
  const { href, tracking } = linkFor(cta, cleanRef(useSearchParams().get("ref")) || pageRef);
  return <ButtonLink href={href} variant={variant} tracking={tracking}>{cta.label}</ButtonLink>;
}

/**
 * A Services call to action. A visitor who arrived with ?ref= (an ad, a group post)
 * keeps that ref on the booking or form link and on the analytics event, so a booking
 * can be traced to its source. The server-rendered fallback carries the page's own ref.
 */
export function CtaLink({ cta, pageRef, variant = "primary" }: CtaLinkProps) {
  const { href, tracking } = linkFor(cta, pageRef);
  return (
    <Suspense fallback={<ButtonLink href={href} variant={variant} tracking={tracking}>{cta.label}</ButtonLink>}>
      <CarriedLink cta={cta} pageRef={pageRef} variant={variant} />
    </Suspense>
  );
}
