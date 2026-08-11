"use client";

import { useEffect } from "react";

const TARGETS = "a, button, .work-item, .founder-card";

export function useCursor() {
  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const cursor = document.getElementById("loopCursor");
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(TARGETS)) cursor.classList.add("is-active");
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const to = e.relatedTarget as Element | null;
      if (target?.closest(TARGETS) && !to?.closest(TARGETS)) {
        cursor.classList.remove("is-active");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
}
