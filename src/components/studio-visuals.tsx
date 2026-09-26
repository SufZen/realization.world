import type { CSSProperties } from "react";

const systemNodes = [
  ["01", "Signal", "A valuable reality is stuck."],
  ["02", "System", "Rights, product and operations connect."],
  ["03", "Evidence", "The model meets the real world."],
  ["04", "Operator", "Continuity gains an owner."],
] as const;

export function StudioSystemMap() {
  return (
    <div className="system-map" aria-label="How Realization turns a physical-world signal into an operating venture">
      <div className="system-map__line" aria-hidden="true" />
      {systemNodes.map(([number, title, text], index) => (
        <article className="system-map__node" key={title}>
          <div className="system-map__signal" aria-hidden="true"><i /></div>
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{text}</p>
          {index < systemNodes.length - 1 && <b aria-hidden="true">→</b>}
        </article>
      ))}
    </div>
  );
}

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
    <div className="market-role-map" aria-label="Realization connects Israeli capital, technology and partners with active opportunities in Portugal">
      <div className="market-role-map__studio"><span>ISRAEL ↔ EUROPE</span><strong>Realization</strong></div>
      <article><span>01 · CONNECT</span><strong>Israel</strong><p>Capital · technology · partners</p></article>
      <article><span>02 · REALIZE</span><strong>Portugal</strong><p>Opportunity · local operation</p></article>
    </div>
  );
}
