import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#FDCC33", color: "#000", fontSize: 34, fontWeight: 900 }}>R</div>,
    size,
  );
}
