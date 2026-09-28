import type { CSSProperties } from "react";

const evidence = [
  ["Discover", "Find the constraint"],
  ["Architect", "Make the system legible"],
  ["Build", "Create the working layer"],
  ["Validate", "Test in reality"],
  ["Transfer", "Place with an operator"],
] as const;

export function EvidenceTrack() {
  return (
    <figure className="evidence-track">
      <figcaption><span>Venture progress</span><strong>Measured by evidence—not activity.</strong></figcaption>
      <div className="evidence-track__chart" role="img" aria-label="Five-stage venture path from discovery to transfer">
        {evidence.map(([stage, outcome], index) => (
          <div className="evidence-track__bar" key={stage} style={{ "--bar-step": index + 1 } as CSSProperties}>
            <i aria-hidden="true" />
            <div><span>0{index + 1}</span><strong>{stage}</strong><small>{outcome}</small></div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function MarketRoleMap() {
  return (
    <div className="market-role-map" aria-label="Realization connects Israeli capital and technology with its base in Portugal, and expands into Europe, starting with Spain">
      <div className="market-role-map__studio"><span>ISRAEL → EUROPE</span><strong>Realization</strong></div>
      <article><span>01 · CONNECT</span><strong>Israel</strong><p>Capital · technology · partners</p></article>
      <article><span>02 · BASE</span><strong>Portugal</strong><p>Projects · local operation</p></article>
      <article><span>03 · EXPAND</span><strong>Europe</strong><p>Spain first · from Barcelona</p></article>
    </div>
  );
}
