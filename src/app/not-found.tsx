import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="not-found surface-dark">
      <div className="container-narrow">
        <p className="eyebrow">404 · UNREALIZED ROUTE</p>
        <h1>This path has not been built.</h1>
        <p>The opportunity may still exist. The page does not.</p>
        <ButtonLink href="/" variant="primary">Return home</ButtonLink>
      </div>
    </section>
  );
}
