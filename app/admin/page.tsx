import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Fruitloop — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function loadItems() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("work_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data;
  } catch {
    return null; // dashboard shows a fetch error and can retry client-side
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }
  const initialItems = await loadItems();
  return <AdminDashboard initialItems={initialItems} />;
}
