import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { parseWorkItemForm, revalidateWorkItem } from "@/lib/admin-items";

/** List ALL work items including unpublished (admin only). */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("work_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

/** Create a new work item. */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error: parseError } = parseWorkItemForm(await req.formData());
  if (parseError || !data) {
    return NextResponse.json({ error: parseError ?? "Invalid input" }, { status: 400 });
  }

  const { data: created, error } = await getSupabaseAdmin()
    .from("work_items")
    .insert(data)
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500; // duplicate slug
    return NextResponse.json(
      { error: status === 409 ? `Slug "${data.slug}" already exists` : error.message },
      { status },
    );
  }

  revalidateWorkItem(created.slug);
  return NextResponse.json({ item: created }, { status: 201 });
}
