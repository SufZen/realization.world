import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
  /** Dark background (white grid and name). */
  inverse?: boolean;
  /** Yellow background (the cell turns white). */
  onYellow?: boolean;
};

/** The Realization logo (grid with the lifted yellow cell, 8.11.2026). */
export function BrandMark({ compact = false, inverse = false, onYellow = false }: BrandMarkProps) {
  const tone = onYellow ? "on-yellow" : inverse ? "reversed" : "color";
  return (
    <Link className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} href="/" aria-label="Realization home">
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo, no optimisation needed */}
      <img className="brand-mark__logo" src={compact ? "/brand/realization-symbol.svg" : `/brand/realization-logo-horizontal-${tone}.svg`} alt="" width={compact ? 32 : 175} height={compact ? 32 : 26} />
    </Link>
  );
}
