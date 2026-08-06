import { hasContactChannel } from "@/lib/contact";
import { getPublicListingBySlug } from "@/lib/listings";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ListingOpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ListingOpenGraphImage({ params }: ListingOpenGraphImageProps) {
  const { slug } = await params;
  const listing = hasContactChannel ? getPublicListingBySlug(slug) : undefined;

  if (!listing) notFound();

  const publishedListing = listing.state === "published" ? listing : undefined;
  const price = publishedListing?.price?.display;

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
          <div style={{ color: "#c9aa66", display: "flex", fontFamily: "monospace", fontSize: 15, letterSpacing: "3px", textTransform: "uppercase" }}>
            Ultramar.capital / Real Estate
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "720px" }}>
            <span style={{ color: "#b9c8bc", fontFamily: "monospace", fontSize: 15, letterSpacing: "2.5px", textTransform: "uppercase" }}>
              {listing.kind} · {listing.location}
            </span>
            <span style={{ fontFamily: "serif", fontSize: 70, letterSpacing: "-3.5px", lineHeight: 0.94, marginTop: 20 }}>
              {listing.name}
            </span>
          </div>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#b9c8bc", fontFamily: "monospace", fontSize: 14, letterSpacing: "2px", textTransform: "uppercase" }}>
              {publishedListing ? "Venta directa · ficha comercial" : "Ficha inicial · información en preparación"}
            </span>
            {price ? (
              <span style={{ color: "#edf0e7", fontFamily: "serif", fontSize: 27, letterSpacing: "-1px" }}>
                {price}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
