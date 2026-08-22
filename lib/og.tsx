import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Shared branded Open Graph renderers (server-only — reads bundled TTFs).
 * Consumed by app/api/og routes and root opengraph-image.
 */

const INK = "#15161B";
const CREAM = "#FFF8E7";
const YELLOW = "#F8D612";
const LIME = "#C7F135";

export type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };
export type OgFonts = { fonts: OgFont[] };

export async function loadOgFonts(): Promise<OgFonts> {
  try {
    const [anton, grotesk] = await Promise.all([
      readFile(path.join(process.cwd(), "public/fonts/anton.ttf")),
      readFile(path.join(process.cwd(), "public/fonts/space-grotesk-700.ttf")),
    ]);
    const buf = (b: Buffer) =>
      b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as unknown as ArrayBuffer;
    return {
      fonts: [
        { name: "Anton", data: buf(anton), weight: 400, style: "normal" },
        { name: "Grotesk", data: buf(grotesk), weight: 700, style: "normal" },
      ],
    };
  } catch {
    return { fonts: [] }; // fall back to default font rather than failing the image
  }
}

export function workOgElement({
  title,
  categoryLabel,
  posterUrl,
}: {
  title: string;
  categoryLabel: string;
  posterUrl?: string | null;
}) {
  // Scale headline so even long titles stay inside the card
  const titleSize = title.length > 48 ? 58 : title.length > 26 ? 72 : 88;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: INK, color: CREAM }}>
      {/* Text column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "56px 48px 48px 64px" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: LIME,
              color: INK,
              fontFamily: "Grotesk",
              fontSize: 26,
              fontWeight: 700,
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {categoryLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Anton",
            fontSize: titleSize,
            lineHeight: 1.08,
            textTransform: "uppercase",
            marginTop: 36,
            maxWidth: 580,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 22, height: 22, backgroundColor: "#E9622A", borderRadius: 999 }} />
          <div style={{ display: "flex", fontFamily: "Anton", fontSize: 40, color: YELLOW }}>FRUITLOOP®</div>
          <div style={{ display: "flex", fontFamily: "Grotesk", fontSize: 24, opacity: 0.7 }}>case study</div>
        </div>
      </div>

      {/* Poster column */}
      {posterUrl && (
        <div style={{ display: "flex", width: 480, height: 630 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterUrl} alt="" width={480} height={630} style={{ objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}

/** Public CDN url for a flat filename inside the `work` bucket. */
export function workPosterUrl(posterPath?: string | null): string | null {
  if (!posterPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/work/${posterPath}`;
}

export function homeOgElement() {
  const ORANGE = "#E9622A";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: YELLOW,
        padding: 64,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {[ORANGE, INK, LIME, CREAM].map((c) => (
          <div key={c} style={{ display: "flex", width: 34, height: 34, borderRadius: 999, backgroundColor: c }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontFamily: "Anton", fontSize: 190, lineHeight: 1, color: INK }}>
          FRUITLOOP®
        </div>
        <div style={{ display: "flex", fontFamily: "Grotesk", fontSize: 38, fontWeight: 700, color: INK, marginTop: 18 }}>
          Creative that refuses to be ignored.
        </div>
      </div>
    </div>
  );
}
