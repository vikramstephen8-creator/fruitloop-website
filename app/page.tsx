import Hero, { type HeroSlideItem } from "@/components/Hero";
import Why from "@/components/Why";
import Services, { type ServiceItem } from "@/components/Services";
import Reel from "@/components/Reel";
import Work, { type WorkGridItem } from "@/components/Work";
import Choose from "@/components/Choose";
import Founders, { type FounderPerson } from "@/components/Founders";
import Brands, { type BrandLogo } from "@/components/Brands";
import Contact, { type ContactSettings } from "@/components/Contact";
import { SITE } from "@/lib/data";
import {
  getWorkItems,
  getHeroSlides,
  getServices,
  getTeamMembers,
  getBrands,
  getSiteSettings,
  transformWorkItem,
  transformTeamMember,
  transformBrand,
} from "@/lib/data-dynamic";

export const revalidate = 3600;

async function loadHomeData() {
  const [work, slides, services, team, brands, settings] = await Promise.allSettled([
    getWorkItems(),
    getHeroSlides(),
    getServices(),
    getTeamMembers(),
    getBrands(),
    getSiteSettings(),
  ]);

  const gridItems: WorkGridItem[] | undefined =
    work.status === "fulfilled"
      ? work.value.map((item) => {
          const t = transformWorkItem(item);
          return {
            slug: item.slug,
            title: item.title,
            cat: item.category,
            img: t.posterUrlOptimized(1200),
          };
        })
      : undefined;

  let slide: HeroSlideItem | undefined;
  if (slides.status === "fulfilled" && slides.value[0]) {
    const s = slides.value[0];
    slide = {
      headline: s.headline,
      subheadline: s.subheadline,
      ctaText: s.cta_text,
      ctaHref: s.cta_href,
    };
  }

  const serviceItems: ServiceItem[] | undefined =
    services.status === "fulfilled"
      ? services.value.map((s) => ({
          num: String(s.sort_order).padStart(2, "0"),
          title: s.title,
          body: s.short_description ?? s.long_description ?? "",
        }))
      : undefined;

  const people: FounderPerson[] | undefined =
    team.status === "fulfilled"
      ? team.value.map((m) => ({
          name: m.name,
          role: m.role,
          bio: m.bio ?? "",
          photoUrl: transformTeamMember(m).photoUrl,
        }))
      : undefined;

  const logos: BrandLogo[] | undefined =
    brands.status === "fulfilled"
      ? brands.value.map((b) => ({
          id: b.id,
          name: b.name,
          logoUrl: transformBrand(b).logoUrl,
        }))
      : undefined;

  const contactSettings: ContactSettings | undefined =
    settings.status === "fulfilled" && settings.value
      ? {
          email: settings.value.contact_email ?? SITE.email,
          phones:
            settings.value.phone_numbers && settings.value.phone_numbers.length > 0
              ? settings.value.phone_numbers
              : SITE.phones,
        }
      : undefined;

  return { gridItems, slide, serviceItems, people, logos, contactSettings };
}

export default async function Page() {
  const { gridItems, slide, serviceItems, people, logos, contactSettings } =
    await loadHomeData();

  return (
    <>
      <Hero slide={slide} />
      <Why />
      <Services items={serviceItems} />
      <Reel />
      <Work items={gridItems} />
      <Choose />
      <Founders people={people} />
      <Brands logos={logos} />
      <Contact settings={contactSettings} />
    </>
  );
}
