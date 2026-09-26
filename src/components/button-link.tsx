import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "dark" | "light" | "outline" | "text";
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
}: ButtonLinkProps) {
  const external = href.startsWith("http");
  return (
    <Link
      className={`button button--${variant} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {arrow && <ArrowRight className="r-flip-x" aria-hidden="true" size={17} strokeWidth={2.2} />}
    </Link>
  );
}
