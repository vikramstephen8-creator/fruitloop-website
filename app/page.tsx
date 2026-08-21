import Hero from "@/components/Hero";
import Why from "@/components/Why";
import Services from "@/components/Services";
import Reel from "@/components/Reel";
import Work, { type WorkGridItem } from "@/components/Work";
import Choose from "@/components/Choose";
import Founders from "@/components/Founders";
import Brands from "@/components/Brands";
import Contact from "@/components/Contact";
import { getWorkItems, transformWorkItem } from "@/lib/data-dynamic";

export const revalidate = 3600;

async function getGridItems(): Promise<WorkGridItem[] | undefined> {
  try {
    const items = await getWorkItems();
    return items.map((item) => {
      const t = transformWorkItem(item);
      return {
        slug: item.slug,
        title: item.title,
        cat: item.category,
        img: t.posterUrlOptimized(1200),
      };
    });
  } catch {
    // DB unreachable at build/render time — Work falls back to static data
    return undefined;
  }
}

export default async function Page() {
  const gridItems = await getGridItems();

  return (
    <>
      <Hero />
      <Why />
      <Services />
      <Reel />
      <Work items={gridItems} />
      <Choose />
      <Founders />
      <Brands />
      <Contact />
    </>
  );
}
