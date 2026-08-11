"use client";

import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { FOUNDERS } from "@/lib/data";

export default function Founders() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="founders" id="founders" ref={ref}>
      <span className="section-eyebrow">{FOUNDERS.eyebrow}</span>
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
