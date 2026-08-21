import { revalidatePath } from "next/cache";
import { CATEGORIES, type Category } from "./categories";

export type WorkItemInput = {
  slug: string;
  category: Category;
  title: string;
  description: string | null;
  poster_path: string;
  video_path: string | null;
  case_study_url: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  published_at: string | null;
};

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Parse + validate FormData into a partial work_items payload. */
export function parseWorkItemForm(form: FormData): {
  data?: Partial<WorkItemInput>;
  error?: string;
} {
  const title = String(form.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };

  const category = String(form.get("category") ?? "") as Category;
  if (!CATEGORIES.includes(category)) return { error: "Invalid category" };

  const slug = String(form.get("slug") ?? "").trim();
  if (!slugRe.test(slug)) return { error: "Slug must be kebab-case (a-z, 0-9, dashes)" };

  const poster_path = String(form.get("poster_path") ?? "").trim();
  if (!poster_path) return { error: "Poster path is required" };

  const description = String(form.get("description") ?? "").trim();
  const caseStudyUrl = String(form.get("case_study_url") ?? "").trim();
  const videoPath = String(form.get("video_path") ?? "").trim();
  const tags = String(form.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const sortOrderRaw = Number(form.get("sort_order") ?? 0);
  const published = form.get("published") === "on" || form.get("published") === "true";

  return {
    data: {
      slug,
      category,
      title,
      description: description || null,
      poster_path,
      video_path: videoPath || null,
      case_study_url: caseStudyUrl || null,
      tags,
      featured: form.get("featured") === "on" || form.get("featured") === "true",
      sort_order: Number.isFinite(sortOrderRaw) ? Math.trunc(sortOrderRaw) : 0,
      published_at: published ? new Date().toISOString() : null,
    },
  };
}

/** Revalidate every surface that renders this item. */
export function revalidateWorkItem(slug: string) {
  revalidatePath("/");
  revalidatePath(`/work/${slug}`);
}
