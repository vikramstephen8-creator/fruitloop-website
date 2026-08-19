"use client";

import { useRef } from "react";
import { WORK, WORK_FILTERS, WORK_ITEMS } from "@/lib/data";
import { useFilter } from "@/hooks/useFilter";
import { useReveal } from "@/hooks/useReveal";

const catLabel = (cat: string) =>
  WORK_FILTERS.find((f) => f.key === cat)?.label ?? cat;

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const { active, setActive } = useFilter(WORK_ITEMS);
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
        {WORK_ITEMS.map((item) => {
          const content = (
            <figure
              key={item.title}
              className={`work-item${active !== "all" && item.cat !== active ? " is-hidden" : ""}`}
              data-cat={item.cat}
            >
              <div className="peel-frame">
                <img src={item.img} alt={`Work frame — ${item.title}`} loading="lazy" />
              </div>
              <figcaption>
                <span>{catLabel(item.cat)}</span>
                {item.title}
              </figcaption>
            </figure>
          );
          return item.href ? <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
        })}
      </div>
    </section>
  );
}
