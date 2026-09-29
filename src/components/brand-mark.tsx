import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({ compact = false, inverse = false }: BrandMarkProps) {
  return (
    <Link className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} href="/" aria-label="Realization home">
      <span className="brand-mark__image">
        <Image src="/brand/butterfly-mark-96.png" alt="" fill sizes="42px" priority />
      </span>
      {!compact && (
        <span className="brand-mark__type">
          <strong className={inverse ? "text-white" : ""}>Realization</strong>
          <small className={inverse ? "text-white-muted" : ""}>Real estate · Ventures · Systems</small>
        </span>
      )}
    </Link>
  );
}
