import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminCookieOptions, adminToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };

  if (!password || !process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken(), adminCookieOptions());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
