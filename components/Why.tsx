"use client";

import { useRef } from "react";
import { WHY } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Why() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="why has-loops" id="why" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--yellow sl-lg sl-tl sl-d1" />
        <span className="sl sl--orange sl-sm sl-br sl-d4" />
        <span className="sl sl--lime sl-md sl-ml sl-d7" />
      </div>
      <div className="why-inner">
        <span className="section-eyebrow">{WHY.eyebrow}</span>
        <h2 className="why-title">
          {WHY.title[0]}
          <br />
          <span className="text-outline">{WHY.title[1]}</span>
        </h2>
        <p className="why-body">{WHY.body}</p>

        <div className="vm-grid">
          <div className="vm-card">
            <span className="vm-label">Vision</span>
            <p>{WHY.vision}</p>
          </div>
          <div className="vm-card vm-card--accent">
            <span className="vm-label">Mission</span>
            <p>{WHY.mission}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
