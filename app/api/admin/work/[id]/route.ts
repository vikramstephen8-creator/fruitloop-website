import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { parseWorkItemForm, revalidateWorkItem } from "@/lib/admin-items";

type Ctx = { params: Promise<{ id: string }> };

/** Update an existing work item. */
export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const { data: prev } = await getSupabaseAdmin()
    .from("work_items")
    .select("slug")
    .eq("id", id)
    .single();
  if (!prev) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const { data, error: parseError } = parseWorkItemForm(await req.formData());
  if (parseError || !data) {
    return NextResponse.json({ error: parseError ?? "Invalid input" }, { status: 400 });
  }

  const { data: updated, error } = await getSupabaseAdmin()
    .from("work_items")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? `Slug "${data.slug}" already exists` : error.message },
      { status },
    );
  }

  // Slug may have changed — revalidate both old and new paths
  revalidateWorkItem(prev.slug);
  revalidateWorkItem(updated.slug);
  return NextResponse.json({ item: updated });
}

/** Delete a work item. */
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const { data: prev } = await getSupabaseAdmin()
    .from("work_items")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await getSupabaseAdmin().from("work_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (prev) revalidateWorkItem(prev.slug);
  return NextResponse.json({ ok: true });
}
