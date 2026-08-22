import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ContentManager from "@/components/admin/ContentManager";
import { CONTENT_TABLES } from "@/lib/admin-content";

export const metadata: Metadata = {
  title: "Fruitloop — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const TABS = [
  { key: "campaigns", label: "Campaigns" },
  { key: "hero_slides", label: "Hero" },
  { key: "services", label: "Services" },
  { key: "team_members", label: "Team" },
  { key: "brands", label: "Brands" },
  { key: "site_settings", label: "Settings" },
];

async function loadItems() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("work_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

// Imported here (server-only module) rather than top-level to keep the
// client bundle clean — see components/admin for client-safe imports.
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const { tab } = await searchParams;
  const active = TABS.some((t) => t.key === tab) ? tab! : "campaigns";
  const spec = CONTENT_TABLES[active];

  return (
    <section className="admin">
      <div className="admin-inner">
        <div className="admin-head">
          <h1 className="admin-title">Fruitloop Admin</h1>
          <Link href="/" className="admin-btn admin-btn--ghost">
            View site ↗
          </Link>
        </div>

        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin?tab=${t.key}`}
              className={`filter-btn${active === t.key ? " is-active" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {active === "campaigns" ? (
          <AdminDashboard initialItems={await loadItems()} />
        ) : spec ? (
          <ContentManager
            key={active}
            table={active}
            title={spec.title}
            fields={spec.fields}
            singleton={spec.singleton}
          />
        ) : null}
      </div>
    </section>
  );
}
