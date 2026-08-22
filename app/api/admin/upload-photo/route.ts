import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_BUCKETS = ["hero", "founders", "logos"];
// Flat filenames only — no directories, no traversal
const SAFE_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

/**
 * Upload a file into a public bucket at a flat path (overwrite in place).
 * Used for founder photos, brand logos, and hero images.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const bucket = String(form.get("bucket") ?? "");
  const path = String(form.get("path") ?? "");
  const file = form.get("file");

  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: `Bucket not allowed: ${bucket}` }, { status: 400 });
  }
  if (!SAFE_NAME.test(path)) {
    return NextResponse.json(
      { error: "Path must be a plain filename like photo.jpg" },
      { status: 400 },
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await getSupabaseAdmin().storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  return NextResponse.json({ ok: true, bucket, path });
}
