import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "fl_admin";

/**
 * Derive the session token from the admin password.
 * Rotating ADMIN_PASSWORD invalidates existing sessions.
 */
export function adminToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Missing ADMIN_PASSWORD");
  return createHash("sha256").update(`fruitloop:${password}`).digest("hex");
}

/** Check the request's cookie against the expected token. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}

/** Cookie options for the admin session. */
export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
