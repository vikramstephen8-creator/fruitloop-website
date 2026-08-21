import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, STORAGE_BUCKETS } from "@/lib/supabase";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Replace the poster image for a work item.
 * Uploads to the same storage path as poster_path (overwrite in place),
 * so no DB change is needed. Short cache TTL so updates propagate.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const id = String(form.get("id") ?? "");
  const file = form.get("file");

  if (!id) return NextResponse.json({ error: "Missing item id" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
  }

  const { data: item } = await getSupabaseAdmin()
    .from("work_items")
    .select("poster_path")
    .eq("id", id)
    .single();
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await getSupabaseAdmin().storage
    .from(STORAGE_BUCKETS.WORK)
    .upload(item.poster_path, bytes, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600", // 1h so replaced posters propagate quickly
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  return NextResponse.json({ ok: true, path: item.poster_path });
}
