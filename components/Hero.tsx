"use client";

import { Fragment, useRef, type ReactNode, type CSSProperties } from "react";
import { HERO } from "@/lib/data";
import { useReveal } from "@/hooks/useReveal";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const winkIndex = HERO.sub.indexOf("(couldn't resist)");
  let sub: ReactNode = HERO.sub;
  if (winkIndex !== -1) {
    sub = (
      <>
        {HERO.sub.slice(0, winkIndex)}
        <span className="wink">(couldn't resist)</span>
        {HERO.sub.slice(winkIndex + "(couldn't resist)".length)}
      </>
    );
  }

  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg-shapes" aria-hidden="true">
        <span className="ring ring-a" />
        <span className="ring ring-b" />
        <span className="loop-o loop-o1" />
        <span className="loop-o loop-o2" />
        <span className="loop-o loop-o3" />
        <span className="loop-o loop-o4" />
        <span className="loop-o loop-o5" />
        <span className="loop-o loop-o6" />
        <span className="loop-o loop-o7" />
        <span className="loop-o loop-o8" />
        <span className="loop-o loop-o9" />
        <span className="loop-o loop-o10" />
      </div>

      <div className="hero-inner">
        <p className="eyebrow reveal-up">{HERO.eyebrow}</p>
        <h1 className="hero-title">
          {HERO.lines.map((line, i) =>
            line.style === "em" ? (
              <span
                key={i}
                className="line reveal-up"
                style={{ "--d": i + 1 } as CSSProperties}
              >
                <em>{line.text}</em>
              </span>
            ) : (
              <span
                key={i}
                className="line reveal-up"
                style={{ "--d": i + 1 } as CSSProperties}
              >
                {line.text}
              </span>
            )
          )}
        </h1>
        <p className="hero-sub reveal-up" style={{ "--d": 4 } as CSSProperties}>
          {sub}
        </p>
        <div className="hero-actions reveal-up" style={{ "--d": 5 } as CSSProperties}>
          <a href="#contact" className="btn btn-primary">
            <span>{HERO.ctaPrimary}</span>
          </a>
          <a href="#reel" className="btn btn-ghost">
            <span className="play-dot" /> {HERO.ctaGhost}
          </a>
        </div>
      </div>

      <div className="hero-badge" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="badge-spin">
          <defs>
            <path
              id="badgeCircle"
              d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
            />
          </defs>
          <text fontSize="14.5" letterSpacing="2" fill="var(--ink)">
            <textPath href="#badgeCircle">
              GO FRUITLOOP • GET NOTICED • GO FRUITLOOP • GET NOTICED •
            </textPath>
          </text>
        </svg>
        <div className="badge-center">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="var(--ink)"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...HERO.marquee, ...HERO.marquee].map((word, i) => (
            <Fragment key={i}>
              <span>{word}</span>
              <span className="sep">✺</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
