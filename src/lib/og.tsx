import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card in the site's black-and-yellow system. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#fff", padding: 72 }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", borderTop: "2px solid #FDCC33", borderBottom: "1px solid #555", padding: "32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", background: "#FDCC33", color: "#000", fontSize: 28, fontWeight: 900 }}>R</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>REALIZATION</div>
        </div>
        <div style={{ display: "flex", maxWidth: 1000, flexDirection: "column" }}>
          <div style={{ color: "#FDCC33", fontSize: 20, letterSpacing: ".14em", fontWeight: 700 }}>{eyebrow}</div>
          <div style={{ marginTop: 22, fontSize: title.length > 48 ? 54 : 68, lineHeight: 1.05, letterSpacing: "-.04em", fontWeight: 800 }}>{title}</div>
        </div>
        <div style={{ display: "flex", color: "#999", fontSize: 18, letterSpacing: ".12em" }}>{footer}</div>
      </div>
    </div>,
    ogSize,
  );
}
