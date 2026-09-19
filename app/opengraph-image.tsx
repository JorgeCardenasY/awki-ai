import { ImageResponse } from "next/og";

export const alt =
  "Awki AI Tech — Trazabilidad logística sin cobertura celular en el altiplano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#e6edf3",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#00ffcc" }}>
          awki@node:~$
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            <span>Trazabilidad logística </span>
            <span style={{ color: "#00ffcc" }}>sin cobertura celular</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#8b98a5",
              marginTop: 24,
            }}
          >
            Edge AI · LoRaWAN · Privacidad by design (Ley 21.719)
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#4b5663" }}>
          AWKI AI TECH · Macrozona Norte, Chile
        </div>
      </div>
    ),
    size
  );
}

