"use client";

import Link from "next/link";
import { useRef } from "react";
import { WORK, WORK_FILTERS, WORK_ITEMS } from "@/lib/data";
import { useFilter } from "@/hooks/useFilter";
import { useReveal } from "@/hooks/useReveal";

export type WorkGridItem = {
  slug: string;
  title: string;
  cat: "ad" | "food" | "hospitality";
  img: string;
};

const catLabel = (cat: string) =>
  WORK_FILTERS.find((f) => f.key === cat)?.label ?? cat;

export default function Work({ items }: { items?: WorkGridItem[] }) {
  const gridItems = items ?? WORK_ITEMS;
  const ref = useRef<HTMLElement>(null);
  const { active, setActive } = useFilter(gridItems);
  useReveal(ref);

  return (
    <section className="work has-loops" id="work" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--orange-d sl-md sl-tr sl-d1" />
        <span className="sl sl--yellow sl-lg sl-bl sl-d4" />
        <span className="sl sl--lime sl-sm sl-ml sl-d7" />
      </div>
      <div className="work-head">
        <h2 className="work-title">
          {WORK.title[0]}
          <br />
          {WORK.title[1]}
          <br />
          <span className="text-outline-dark">{WORK.title[2]}</span>
        </h2>
        <div
          className="work-filters"
          role="tablist"
          aria-label="Filter work by category"
        >
          {WORK_FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn${active === filter.key ? " is-active" : ""}`}
              data-filter={filter.key}
              role="tab"
              aria-selected={active === filter.key}
              onClick={() => setActive(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="work-grid"
        id="workGrid"
        role="tabpanel"
        aria-label="Work items"
      >
        {gridItems.map((item) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            className={`work-item${active !== "all" && item.cat !== active ? " is-hidden" : ""}`}
            data-cat={item.cat}
            aria-label={`${item.title} case study`}
          >
            <figure>
              <div className="peel-frame">
                <img src={item.img} alt={`Work frame — ${item.title}`} loading="lazy" />
              </div>
              <figcaption>
                <span>{catLabel(item.cat)}</span>
                {item.title}
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </section>
  );
}
