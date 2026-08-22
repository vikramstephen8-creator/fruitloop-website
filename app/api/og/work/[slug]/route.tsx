import { ImageResponse } from "next/og";
import { getWorkItem } from "@/lib/data-dynamic";
import { WORK_FILTERS } from "@/lib/data";
import { loadOgFonts, workOgElement, workPosterUrl } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Revalidate hourly like the pages that reference it
export const revalidate = 3600;

/** Branded OG card for a case study: GET /api/og/work/<slug> */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const [item, fonts] = await Promise.all([getWorkItem(slug), loadOgFonts()]);

  const categoryLabel =
    WORK_FILTERS.find((f) => f.key === item?.category)?.label ??
    item?.category ??
    "";

  return new ImageResponse(
    workOgElement({
      title: item?.title ?? "Case study",
      categoryLabel,
      posterUrl: workPosterUrl(item?.poster_path),
    }),
    { ...size, ...fonts },
  );
}
