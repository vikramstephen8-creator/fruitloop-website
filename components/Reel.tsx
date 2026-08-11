"use client";

import { REEL } from "@/lib/data";
import { useReel } from "@/hooks/useReel";

export default function Reel() {
  const { videoRef, playing, shaking, play } = useReel();

  return (
    <section className="reel" id="reel">
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
