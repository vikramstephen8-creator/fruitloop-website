/**
 * Client-safe content-table specifications.
 * Shared by admin API routes (server) and ContentManager (client).
 * NOTE: must NOT import next/cache or anything server-only.
 */

export type FieldType = "text" | "textarea" | "bool" | "int" | "tags" | "phones";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Storage bucket used by the "Replace file" uploader rendered for this field */
  uploadBucket?: string;
};

export type TableSpec = {
  title: string;
  fields: FieldSpec[];
  /** Singleton tables (site_settings) have exactly one row — no create/delete */
  singleton?: boolean;
};

export const CONTENT_TABLES: Record<string, TableSpec> = {
  hero_slides: {
    title: "Hero slides",
    fields: [
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "subheadline", label: "Subheadline", type: "textarea" },
      { name: "image_path", label: "Image (in hero bucket)", type: "text", required: true, uploadBucket: "hero" },
      { name: "cta_text", label: "CTA label", type: "text" },
      { name: "cta_href", label: "CTA link", type: "text" },
      { name: "active", label: "Active", type: "bool" },
      { name: "sort_order", label: "Sort order", type: "int" },
    ],
  },
  services: {
    title: "Services",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "short_description", label: "Short description (card)", type: "textarea" },
      { name: "long_description", label: "Long description", type: "textarea" },
      { name: "sort_order", label: "Sort order", type: "int" },
    ],
  },
  team_members: {
    title: "Team",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photo_path", label: "Photo (in founders bucket)", type: "text", uploadBucket: "founders" },
      { name: "sort_order", label: "Sort order", type: "int" },
    ],
  },
  brands: {
    title: "Brands",
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true },
      { name: "logo_path", label: "Logo (in logos bucket)", type: "text", required: true, uploadBucket: "logos" },
      { name: "website_url", label: "Website URL", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "featured", label: "Featured", type: "bool" },
      { name: "sort_order", label: "Sort order", type: "int" },
    ],
  },
  site_settings: {
    title: "Site settings",
    singleton: true,
    fields: [
      { name: "site_name", label: "Site name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "contact_email", label: "Contact email", type: "text" },
      {
        name: "phone_numbers",
        label: "Phone numbers — one per line: Label | Value | Href",
        type: "phones",
      },
    ],
  },
};

/** Parse + validate FormData against a table spec (whitelist-only fields). */
export function parseContentForm(
  spec: TableSpec,
  form: FormData,
): { data?: Record<string, unknown>; error?: string } {
  const data: Record<string, unknown> = {};

  for (const field of spec.fields) {
    const raw = form.get(field.name);

    switch (field.type) {
      case "bool":
        data[field.name] = raw === "on" || raw === "true";
        break;

      case "int": {
        const n = Number(raw ?? 0);
        data[field.name] = Number.isFinite(n) ? Math.trunc(n) : 0;
        break;
      }

      case "tags":
        data[field.name] = String(raw ?? "")
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        break;

      case "phones":
        data[field.name] = String(raw ?? "")
          .split("\n")
          .map((line) => line.split("|").map((p) => p.trim()))
          .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
          .map(([label, value, href]) => ({
            label,
            value,
            href: href || `tel:${value.replace(/\s+/g, "")}`,
          }));
        break;

      case "textarea":
      case "text": {
        const str = String(raw ?? "").trim();
        if (field.required && !str) {
          return { error: `"${field.label}" is required` };
        }
        data[field.name] = str || null;
        break;
      }
    }
  }

  return { data };
}
