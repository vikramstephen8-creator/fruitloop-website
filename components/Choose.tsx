"use client";

import { useRef } from "react";
import { CHOOSE } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Choose() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section className="choose has-loops" ref={ref}>
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--ink sl-lg sl-tl sl-d3" />
        <span className="sl sl--ink sl-sm sl-br sl-d6" />
      </div>
      <div className="choose-panel">
        <h2 className="choose-title">
          {CHOOSE.title[0]}
          <br />
          {CHOOSE.title[1]}
        </h2>
        <p className="choose-body">{CHOOSE.body}</p>
      </div>
      <div className="choose-list">
        {CHOOSE.items.map((item) => (
          <div className="choose-item" key={item.index}>
            <span className="choose-index">{item.index}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
