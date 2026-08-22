import type { MetadataRoute } from "next";
import { getWorkItems } from "@/lib/data-dynamic";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let caseStudies: MetadataRoute.Sitemap = [];
  try {
    const items = await getWorkItems();
    caseStudies = items.map((item) => ({
      url: `${BASE}/work/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB hiccup shouldn't break the sitemap — ship homepage at least
  }

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...caseStudies,
  ];
}
