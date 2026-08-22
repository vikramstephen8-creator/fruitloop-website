import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CONTENT_TABLES, parseContentForm } from "@/lib/admin-content";

type Ctx = { params: Promise<{ table: string }> };

function resolve(table: string) {
  const spec = CONTENT_TABLES[table];
  if (!spec) return null;
  return spec;
}

/** List all rows of a content table (admin only). */
export async function GET(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { table } = await ctx.params;
  const spec = resolve(table);
  if (!spec) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  let query = getSupabaseAdmin().from(table).select("*");
  if (!spec.singleton) query = query.order("sort_order", { ascending: true });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return spec.singleton
    ? NextResponse.json({ row: data?.[0] ?? null })
    : NextResponse.json({ rows: data ?? [] });
}

/** Create a row (not available for singleton tables). */
export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { table } = await ctx.params;
  const spec = resolve(table);
  if (!spec) return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  if (spec.singleton) {
    return NextResponse.json({ error: "Settings cannot be created" }, { status: 405 });
  }

  const { data, error: parseError } = parseContentForm(spec, await req.formData());
  if (parseError || !data) {
    return NextResponse.json({ error: parseError ?? "Invalid input" }, { status: 400 });
  }

  const { data: created, error } = await getSupabaseAdmin()
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/");
  return NextResponse.json({ row: created }, { status: 201 });
}
