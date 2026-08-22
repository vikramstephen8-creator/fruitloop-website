import { ImageResponse } from "next/og";
import { loadOgFonts, homeOgElement } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

/** Branded homepage card: GET /api/og/home */
export async function GET() {
  const fonts = await loadOgFonts();
  return new ImageResponse(homeOgElement(), { ...size, ...fonts });
}
