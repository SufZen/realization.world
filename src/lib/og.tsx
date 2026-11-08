import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const logoDataUri = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public/brand/realization-logo-horizontal-reversed.svg")).toString("base64")}`;

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card in the site's black-and-yellow system. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#fff", padding: 72 }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", borderTop: "2px solid #FDCC33", borderBottom: "1px solid #555", padding: "32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri} width={296} height={44} alt="" />
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
