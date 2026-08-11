"use client";

import { useState } from "react";
import type { WorkItem } from "@/lib/data";

export function useFilter(items: WorkItem[]) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? items : items.filter((item) => item.cat === active);
  return { active, setActive, filtered };
}
