"use client";

import { useCursor } from "@/hooks/useCursor";

export default function Cursor() {
  const cursor = (
    <div className="loop-cursor" id="loopCursor" aria-hidden="true" />
  );
  useCursor();
  return cursor;
}
