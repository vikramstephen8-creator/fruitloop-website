import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CONTENT_TABLES, parseContentForm } from "@/lib/admin-content";

type Ctx = { params: Promise<{ table: string; id: string }> };

/** Update a content row. */
export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { table, id } = await ctx.params;
  const spec = CONTENT_TABLES[table];
  if (!spec) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  const { data, error: parseError } = parseContentForm(spec, await req.formData());
  if (parseError || !data) {
    return NextResponse.json({ error: parseError ?? "Invalid input" }, { status: 400 });
  }

  const key = spec.singleton ? 1 : id; // singletons always target row id=1
  const { data: updated, error } = await getSupabaseAdmin()
    .from(table)
    .update(data)
    .eq("id", key)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ row: updated });
}

/** Delete a content row (not available for singleton tables). */
export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { table, id } = await ctx.params;
  const spec = CONTENT_TABLES[table];
  if (!spec) return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  if (spec.singleton) {
    return NextResponse.json({ error: "Settings cannot be deleted" }, { status: 405 });
  }

  const { error } = await getSupabaseAdmin().from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
