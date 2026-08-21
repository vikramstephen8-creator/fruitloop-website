"use client";

import { useRef, type CSSProperties } from "react";
import { SERVICES } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export type ServiceItem = { num: string; title: string; body: string };

export default function Services({ items }: { items?: ServiceItem[] }) {
  const list = items ?? SERVICES.items;
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="services has-loops" id="services" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--cream sl-xl sl-tr sl-d3" />
        <span className="sl sl--yellow sl-sm sl-bl sl-d6" />
        <span className="sl sl--lime sl-md sl-tl sl-d8" />
        <span className="sl sl--cream sl-lg sl-br sl-d2" />
      </div>
      <div className="services-head">
        <h2 className="services-title">
          {SERVICES.title[0]}
          <br />
          {SERVICES.title[1]}
        </h2>
      </div>

      <div className="services-grid">
        {list.map((service, i) => (
          <article
            key={service.num}
            className="service-card"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="service-num">{service.num}</span>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
