"use client";

import { REEL } from "@/lib/data";
import { useReel } from "@/hooks/useReel";

export default function Reel() {
  const { videoRef, playing, shaking, play } = useReel();

  return (
    <section className="reel has-loops" id="reel">
      <div className="section-loops" aria-hidden="true">
        <span className="sl sl--yellow sl-lg sl-tl sl-d1" />
        <span className="sl sl--orange sl-sm sl-br sl-d4" />
        <span className="sl sl--lime sl-md sl-tr sl-d7" />
        <span className="sl sl--yellow sl-xl sl-ml sl-d2" />
        <span className="sl sl--orange-d sl-sm sl-bc sl-d5" />
        <span className="sl sl--lime sl-md sl-mr sl-d8" />
        <span className="sl sl--yellow sl-lg sl-bl sl-d3" />
        <span className="sl sl--orange sl-md sl-tc sl-d6" />
        <span className="sl sl--lime sl-sm sl-tl sl-d4" />
        <span className="sl sl--yellow sl-md sl-br sl-d1" />
      </div>
      <span className="section-eyebrow">{REEL.eyebrow}</span>
      <h2 className="reel-title">{REEL.title}</h2>
      <p className="reel-sub">{REEL.sub}</p>

      <div
        className={`reel-frame${shaking ? " shake" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) play();
        }}
      >
        <img
          className="reel-poster"
          src={REEL.poster}
          alt="Fruitloop showreel poster frame"
          style={{ display: playing ? "none" : undefined }}
        />
        <div
          className="reel-overlay"
          style={{ display: playing ? "none" : undefined }}
        />
        <button
          className="reel-play"
          aria-label="Play showreel"
          onClick={play}
          style={{ display: playing ? "none" : undefined }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="var(--ink)" />
          </svg>
        </button>
        <div className="reel-corner tl" />
        <div className="reel-corner tr" />
        <div className="reel-corner bl" />
        <div className="reel-corner br" />

        <video
          id="reelVideo"
          ref={videoRef}
          playsInline
          preload="none"
          poster={REEL.poster}
          style={{ display: "none" }}
        >
          {/* <source src="/assets/reel/showreel.mp4" type="video/mp4" /> */}
        </video>
      </div>
      <p className="reel-note">{REEL.note}</p>
    </section>
  );
}
