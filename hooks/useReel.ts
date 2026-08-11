"use client";

import { useEffect, useRef, useState } from "react";

export function useReel() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shaking, setShaking] = useState(false);
  const shakeTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimeout.current !== null) window.clearTimeout(shakeTimeout.current);
    };
  }, []);

  const play = () => {
    const video = videoRef.current;
    if (video && video.querySelector("source")) {
      video.style.display = "block";
      video.setAttribute("controls", "");
      void video.play();
      setPlaying(true);
    } else {
      setShaking(true);
      if (shakeTimeout.current !== null) window.clearTimeout(shakeTimeout.current);
      shakeTimeout.current = window.setTimeout(() => setShaking(false), 500);
    }
  };

  return { videoRef, playing, shaking, play };
}
