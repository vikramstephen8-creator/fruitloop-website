"use client";

import { useEffect, type RefObject } from "react";

const FADE_TARGETS = [
  ".vm-card",
  ".service-card",
  ".work-item",
  ".founder-card",
  ".choose-item",
  ".contact-link",
];

export function useReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const revealEls = container.querySelectorAll<HTMLElement>(".reveal-up");
    const fadeEls = container.querySelectorAll<HTMLElement>(FADE_TARGETS.join(","));

    const revealAll = () => {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      fadeEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    revealEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    fadeEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition =
        "opacity .7s var(--ease), transform .7s var(--ease)";
    });
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setTimeout(() => {
              target.style.opacity = "1";
              target.style.transform = "translateY(0)";
            }, (i % 4) * 70);
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      fadeObserver.disconnect();
    };
  }, [containerRef]);
}
