import { ImageResponse } from "next/og";

export const alt = "Ultramar Real Estate — Casas y terrenos en venta en Morelos e Hidalgo";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#101512",
          color: "#edf0e7",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <svg
          width="740"
          height="630"
          viewBox="0 0 740 630"
          fill="none"
          style={{ color: "#8ea79a", opacity: 0.76, position: "absolute", right: "-40px", top: "0" }}
        >
          {[88, 146, 207, 270, 334, 400, 470, 544].map((offset) => (
            <path
              key={offset}
              d={`M-50 ${offset}C80 ${offset - 120} 146 ${offset + 52} 270 ${offset - 30}c104-69 133-184 277-145 69 19 100 74 215-38`}
              stroke="currentColor"
              strokeWidth={offset === 334 ? 2 : 1}
              strokeDasharray={offset % 2 === 0 ? "3 8" : undefined}
            />
          ))}
        </svg>
        <div
          style={{
            border: "1px solid #52675c",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "46px",
            padding: "38px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontFamily: "serif", fontSize: 32, letterSpacing: "-1px" }}>
            Ultramar<span style={{ fontStyle: "italic" }}>.capital</span>
            <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "3px", marginLeft: 22, paddingTop: 11, textTransform: "uppercase" }}>
              Real Estate
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "690px" }}>
            <span style={{ color: "#c9aa66", fontFamily: "monospace", fontSize: 17, letterSpacing: "3px", textTransform: "uppercase" }}>
              Atlas de propiedades
            </span>
            <span style={{ fontFamily: "serif", fontSize: 76, letterSpacing: "-4px", lineHeight: 0.94, marginTop: 22 }}>
              Casas y terrenos para decidir con contexto.
            </span>
          </div>
          <span style={{ color: "#b9c8bc", fontFamily: "monospace", fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>
            Propiedades seleccionadas · venta directa
          </span>
        </div>
      </div>
    ),
    size,
  );
}
