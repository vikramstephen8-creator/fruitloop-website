"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { BRANDS } from "@/lib/data";

export default function Brands() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const logos = Array.from({ length: BRANDS.logoCount }, (_, i) => i);

  return (
    <>
      <section className="brands has-loops" id="brands" ref={ref}>
        <div className="section-loops" aria-hidden="true">
          <span className="sl sl--yellow sl-xl sl-tr sl-d1" />
          <span className="sl sl--cream sl-md sl-bl sl-d4" />
          <span className="sl sl--lime sl-sm sl-tl sl-d7" />
        </div>
        <span className="section-eyebrow section-eyebrow--light">
          {BRANDS.eyebrow}
        </span>
        <h2 className="brands-title">
          {BRANDS.title[0]}
          <br />
          {BRANDS.title[1]}
        </h2>
      </section>

      <div className="logo-marquee" aria-label="Client and partner logos">
        <div className="logo-track">
          {[...logos, ...logos].map((i, idx) => (
            <img
              key={idx}
              src={`/assets/logos/logo-${String(i).padStart(2, "0")}.png`}
              alt=""
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </>
  );
}
