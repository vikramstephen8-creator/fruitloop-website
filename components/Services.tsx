"use client";

import { useRef, type CSSProperties } from "react";
import { SERVICES } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="services" id="services" ref={ref}>
      <div className="services-head">
        <span className="section-eyebrow section-eyebrow--light">
          {SERVICES.eyebrow}
        </span>
        <h2 className="services-title">
          {SERVICES.title[0]}
          <br />
          {SERVICES.title[1]}
        </h2>
      </div>

      <div className="services-grid">
        {SERVICES.items.map((service, i) => (
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
