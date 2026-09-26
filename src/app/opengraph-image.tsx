import { ImageResponse } from "next/og";

export const alt = "Realization — Realizing untapped potential in the physical world";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#fff", padding: 72, alignItems: "stretch" }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", borderTop: "2px solid #FDCC33", borderBottom: "1px solid #555", padding: "32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ display: "flex", width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", background: "#FDCC33", color: "#000", fontSize: 28, fontWeight: 900 }}>R</div><div style={{ fontSize: 24, fontWeight: 700 }}>REALIZATION</div></div>
        <div style={{ display: "flex", maxWidth: 900, flexDirection: "column" }}><div style={{ color: "#FDCC33", fontSize: 18, letterSpacing: ".14em", fontWeight: 700 }}>REAL ESTATE · VENTURES · SYSTEMS</div><div style={{ marginTop: 22, fontSize: 64, lineHeight: 1.03, letterSpacing: "-.04em", fontWeight: 800 }}>Untapped potential. Realized.</div></div>
        <div style={{ display: "flex", color: "#999", fontSize: 16, letterSpacing: ".12em" }}>PHYSICAL POTENTIAL · DIGITAL SYSTEMS · REALIZED VALUE</div>
      </div>
    </div>,
    size,
  );
}
