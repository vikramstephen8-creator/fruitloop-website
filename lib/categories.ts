export const CATEGORIES = ["ad", "food", "hospitality"] as const;
export type Category = (typeof CATEGORIES)[number];
