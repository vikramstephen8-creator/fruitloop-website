import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { WORK_FILTERS } from "@/lib/data";
import {
  getWorkItem,
  getWorkItems,
  transformWorkItem,
  type WorkItem,
} from "@/lib/data-dynamic";

export const revalidate = 3600;

const catLabel = (cat: string) =>
  WORK_FILTERS.find((f) => f.key === cat)?.label ?? cat;

export async function generateStaticParams() {
  const items = await getWorkItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getWorkItem(slug);
  if (!item) return {};

  return {
    title: `${item.title} — Fruitloop`,
    description:
      item.description ??
      `${item.title} — a ${catLabel(item.category)} case study by Fruitloop.`,
    openGraph: {
      title: `${item.title} — Fruitloop`,
      description: item.description ?? undefined,
      // Branded card rendered by GET /api/og/work/<slug>
      images: [{ url: `/api/og/work/${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/work/${slug}`],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getWorkItem(slug);
  if (!item) notFound();

  const categoryPeers = await getWorkItems(item.category);
  const related: ReturnType<typeof transformWorkItem>[] = categoryPeers
    .filter((peer) => peer.slug !== slug)
    .slice(0, 3)
    .map((peer: WorkItem) => transformWorkItem(peer));

  return (
    <CaseStudy
      item={transformWorkItem(item)}
      categoryLabel={catLabel(item.category)}
      related={related}
    />
  );
}
