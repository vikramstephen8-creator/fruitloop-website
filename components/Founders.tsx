"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { FOUNDERS } from "@/lib/data";

export default function Founders() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="founders has-loops" id="founders" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--yellow sl-lg sl-tr sl-d2" />
        <span className="sl sl--orange sl-sm sl-bl sl-d5" />
        <span className="sl sl--lime sl-md sl-mr sl-d8" />
      </div>
      <h2 className="founders-title">
        {FOUNDERS.title[0]}
        <br />
        {FOUNDERS.title[1]}
      </h2>
      <p className="founders-sub">{FOUNDERS.sub}</p>

      <div className="founders-grid">
        {FOUNDERS.people.map((person) => (
          <article className="founder-card" key={person.name}>
            <div
              className={`founder-photo ${person.photoClass}`}
              aria-hidden="true"
            />
            <h3>{person.name}</h3>
            <span className="founder-role">{person.role}</span>
            <p>{person.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
