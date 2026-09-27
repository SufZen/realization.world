/**
 * Brand diagrams (inline SVG). Lines and text use currentColor, so each diagram works on
 * light and dark surfaces; marigold marks the element that matters. Labels are short so
 * they stay legible when the SVG scales down to phone width.
 */
import type { ReactNode } from "react";

const Y = "#FDCC33";
const INK = "#111";

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <svg className="diagram__svg" viewBox="0 0 640 440" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <g fontFamily="inherit" fill="currentColor">{children}</g>
    </svg>
  );
}

/** Registered vs. licensed vs. built area — why a property can be stuck on paper. */
export function AreaGapDiagram() {
  return (
    <Frame title="The built area is larger than the licensed area, which is larger than the registered area">
      <rect x="30" y="30" width="580" height="380" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="54" y="72" fontSize="26" fontWeight="700">Built</text>
      <text x="54" y="100" fontSize="20" opacity=".7">What stands on site</text>
      <rect x="150" y="140" width="340" height="230" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="12 9" />
      <text x="172" y="178" fontSize="22" fontWeight="700">Licensed</text>
      <rect x="250" y="224" width="170" height="112" fill={Y} />
      <text x="335" y="287" fontSize="22" fontWeight="700" textAnchor="middle" fill={INK}>Registered</text>
    </Frame>
  );
}

/** Turnkey (income now) vs. value-add (dip during works, higher upside). */
export function TurnkeyValueAddDiagram() {
  return (
    <Frame title="Turnkey earns sooner; value-add dips during works, then rises higher">
      <rect x="92" y="40" width="150" height="330" opacity=".07" />
      <text x="167" y="72" fontSize="20" textAnchor="middle" opacity=".75">Works</text>
      <line x1="70" y1="370" x2="610" y2="370" stroke="currentColor" strokeWidth="2.5" />
      <line x1="70" y1="370" x2="70" y2="30" stroke="currentColor" strokeWidth="2.5" />
      <text x="610" y="408" fontSize="20" textAnchor="end" opacity=".75">Time</text>
      <text x="82" y="30" fontSize="20" opacity=".75">Value</text>
      <path d="M70 290 L610 238" fill="none" stroke="currentColor" strokeWidth="4" />
      <text x="600" y="222" fontSize="22" fontWeight="700" textAnchor="end">Turnkey</text>
      <path d="M70 300 C130 330 190 348 242 340 C360 322 470 200 610 110" fill="none" stroke={Y} strokeWidth="6" strokeLinecap="round" />
      <text x="600" y="92" fontSize="22" fontWeight="700" textAnchor="end" fill={Y}>Value-add</text>
    </Frame>
  );
}

/** Order → knowledge → one workflow → pilot. */
export function AiStackDiagram() {
  const layers = [
    { y: 326, w: 580, label: "Order · structure and permissions" },
    { y: 240, w: 530, label: "Knowledge · a searchable graph" },
    { y: 154, w: 480, label: "One workflow · agent + human check" },
    { y: 68, w: 400, label: "Pilot · 8–10 people", accent: true },
  ];
  return (
    <Frame title="AI adoption built bottom-up: order, knowledge, one workflow, then a small pilot">
      {layers.map(({ y, w, label, accent }) => (
        <g key={label}>
          <rect x={320 - w / 2} y={y} width={w} height="66" fill={accent ? Y : "currentColor"} fillOpacity={accent ? 1 : 0.08} stroke={accent ? Y : "currentColor"} strokeWidth="2" />
          <text x="320" y={y + 41} fontSize="21" fontWeight="700" textAnchor="middle" fill={accent ? INK : "currentColor"}>{label}</text>
        </g>
      ))}
      <text x="320" y="36" fontSize="20" textAnchor="middle" opacity=".75">Build upwards</text>
    </Frame>
  );
}

/** AI / listing estimate vs. signed deals. */
export function StreetVsForecastDiagram() {
  return (
    <Frame title="AI estimates built from listings sit above what signed deals show">
      <line x1="60" y1="370" x2="600" y2="370" stroke="currentColor" strokeWidth="2.5" />
      <rect x="120" y="90" width="150" height="280" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeDasharray="10 8" />
      <rect x="330" y="180" width="150" height="190" fill={Y} />
      <text x="195" y="408" fontSize="20" fontWeight="700" textAnchor="middle">AI estimate</text>
      <text x="405" y="408" fontSize="20" fontWeight="700" textAnchor="middle">Signed deals</text>
      <line x1="270" y1="90" x2="540" y2="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" opacity=".6" />
      <line x1="480" y1="180" x2="540" y2="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" opacity=".6" />
      <path d="M540 90 H556 V180 H540" fill="none" stroke={Y} strokeWidth="4" />
      <text x="568" y="142" fontSize="22" fontWeight="700" fill={Y}>Gap</text>
    </Frame>
  );
}

/** Six validation gates narrowing to a venture ready to scale. */
export function GatesFunnelDiagram() {
  const gates = ["Problem", "Rights", "Model", "Regulation", "Operator", "Evidence"];
  return (
    <Frame title="Six validation gates before a venture is ready to scale">
      {gates.map((gate, index) => {
        const w = 560 - index * 56;
        const y = 24 + index * 56;
        return (
          <g key={gate}>
            <rect x={320 - w / 2} y={y} width={w} height="46" fill="currentColor" fillOpacity={0.05 + index * 0.02} stroke="currentColor" strokeWidth="1.5" />
            <text x="320" y={y + 31} fontSize="20" fontWeight="700" textAnchor="middle">{gate}</text>
          </g>
        );
      })}
      <rect x="210" y="370" width="220" height="52" rx="26" fill={Y} />
      <text x="320" y="403" fontSize="21" fontWeight="700" textAnchor="middle" fill={INK}>Ready to scale</text>
    </Frame>
  );
}

/** Israel ↔ Portugal bridge. */
export function MarketBridgeDiagram() {
  return (
    <Frame title="Realization connects Israeli capital, technology and partners with opportunities in Portugal">
      <path d="M205 214 Q320 40 435 214" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 9" />
      <text x="320" y="118" fontSize="22" fontWeight="700" textAnchor="middle">Realization</text>
      <circle cx="140" cy="262" r="78" fill={Y} />
      <text x="140" y="270" fontSize="22" fontWeight="700" textAnchor="middle" fill={INK}>Portugal</text>
      <circle cx="500" cy="262" r="78" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="500" y="270" fontSize="22" fontWeight="700" textAnchor="middle">Israel</text>
      <text x="140" y="378" fontSize="20" textAnchor="middle" opacity=".8">Opportunity</text>
      <text x="140" y="402" fontSize="20" textAnchor="middle" opacity=".8">Local operation</text>
      <text x="500" y="378" fontSize="20" textAnchor="middle" opacity=".8">Capital · technology</text>
      <text x="500" y="402" fontSize="20" textAnchor="middle" opacity=".8">Partners</text>
    </Frame>
  );
}

/** Development sequence: design is complete before contractors price it. */
export function DesignSequenceDiagram() {
  const steps = ["Architecture", "Specialties", "Specification", "Contractor bids"];
  return (
    <Frame title="Sequence: architecture, then specialty designs, then specification, then contractor bids">
      {steps.map((step, index) => {
        const y = 22 + index * 104;
        const last = index === steps.length - 1;
        return (
          <g key={step}>
            <rect x="140" y={y} width="360" height="70" rx="35" fill={last ? Y : "none"} stroke={last ? Y : "currentColor"} strokeWidth="2.5" />
            <text x="320" y={y + 44} fontSize="24" fontWeight="700" textAnchor="middle" fill={last ? INK : "currentColor"}>{step}</text>
            {!last && <path d={`M320 ${y + 74} V${y + 98} M308 ${y + 86} L320 ${y + 100} L332 ${y + 86}`} fill="none" stroke="currentColor" strokeWidth="2.5" />}
          </g>
        );
      })}
    </Frame>
  );
}

/** Diagram used as the cover of each field note, by slug. */
export const insightDiagrams: Record<string, () => ReactNode> = {
  "when-the-registry-and-the-building-disagree": AreaGapDiagram,
  "design-first-then-ask-for-a-price": DesignSequenceDiagram,
  "turnkey-or-value-add": TurnkeyValueAddDiagram,
  "ai-in-the-office-start-with-knowledge": AiStackDiagram,
  "trust-the-street-over-the-forecast": StreetVsForecastDiagram,
};
