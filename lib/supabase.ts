import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazy-initialized Supabase clients.
 * Getters avoid module-level env access so scripts can load dotenv first,
 * and Next.js only inlines the NEXT_PUBLIC_* vars it knows about.
 */

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Client-side Supabase client (browser-safe, uses anon key).
 * Respects RLS — use for all public reads.
 */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return _supabase;
}

/**
 * Server-side admin client (service role key — bypasses RLS).
 * Use ONLY in Server Components, API routes, and scripts.
 * NEVER import this from client-side code paths.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  return _supabaseAdmin;
}

/**
 * Get public URL for a storage object.
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = getSupabase().storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get optimized image URL using Supabase Image Transform.
 */
export function getOptimizedImageUrl(
  bucket: string,
  path: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'original';
  } = {},
): string {
  const baseUrl = getPublicUrl(bucket, path);
  const params = new URLSearchParams();

  if (options.width) params.set('width', String(options.width));
  if (options.height) params.set('height', String(options.height));
  if (options.quality) params.set('quality', String(options.quality));
  if (options.format && options.format !== 'original') params.set('format', options.format);

  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
}

/**
 * Storage bucket names (centralized).
 */
export const STORAGE_BUCKETS = {
  HERO: 'hero',
  WORK: 'work',
  LOGOS: 'logos',
  REEL: 'reel',
  FOUNDERS: 'founders',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
