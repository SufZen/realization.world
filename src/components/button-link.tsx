import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { trackingFor } from "@/lib/tracking";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "dark" | "light" | "outline" | "text";
  arrow?: boolean;
  className?: string;
  /** Analytics attributes; defaults to lib/tracking.ts for the href. */
  tracking?: Record<string, string>;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
  tracking,
}: ButtonLinkProps) {
  const external = href.startsWith("http");
  return (
    <Link
      className={`button button--${variant} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(tracking ?? trackingFor(href))}
    >
      <span>{children}</span>
      {arrow && <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />}
    </Link>
  );
}
