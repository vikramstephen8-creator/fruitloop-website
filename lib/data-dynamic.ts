/**
 * Dynamic data fetching from Supabase
 * Replaces static lib/data.ts for production use
 * Falls back to static data during build if needed
 */

import { getSupabase, getPublicUrl, getOptimizedImageUrl, STORAGE_BUCKETS } from './supabase';

// Types matching database schema
export interface WorkItem {
  id: string;
  slug: string;
  category: 'ad' | 'food' | 'hospitality';
  title: string;
  description: string | null;
  poster_path: string;
  video_path: string | null;
  case_study_url: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  headline: string;
  subheadline: string | null;
  image_path: string;
  cta_text: string | null;
  cta_href: string | null;
  active: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  long_description: string | null;
  icon_name: string | null;
  color_token: string | null;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_path: string | null;
  social_links: Record<string, string> | null;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  logo_path: string;
  website_url: string | null;
  category: string | null;
  featured: boolean;
  sort_order: number;
}

export interface SiteSettings {
  site_name: string;
  tagline: string | null;
  contact_email: string | null;
  phone_numbers: Array<{ label: string; value: string; href: string }>;
  social_links: Record<string, string>;
  seo_defaults: Record<string, string>;
}

/**
 * Fetch all published work items, optionally filtered by category
 */
export async function getWorkItems(category?: string): Promise<WorkItem[]> {
  const client = getSupabase();
  
  let query = client
    .from('work_items')
    .select('*')
    .not('published_at', 'is', null)
    .order('sort_order', { ascending: true });
  
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch work items: ${error.message}`);
  return data || [];
}

/**
 * Fetch single work item by slug
 */
export async function getWorkItem(slug: string): Promise<WorkItem | null> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('work_items')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch work item: ${error.message}`);
  }
  return data;
}

/**
 * Fetch active hero slides
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`Failed to fetch hero slides: ${error.message}`);
  return data || [];
}

/**
 * Fetch all services
 */
export async function getServices(): Promise<Service[]> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`Failed to fetch services: ${error.message}`);
  return data || [];
}

/**
 * Fetch all team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(`Failed to fetch team members: ${error.message}`);
  return data || [];
}

/**
 * Fetch all brands (for logo marquee)
 */
export async function getBrands(featuredOnly = false): Promise<Brand[]> {
  const client = getSupabase();
  
  let query = client
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (featuredOnly) {
    query = query.eq('featured', true);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch brands: ${error.message}`);
  return data || [];
}

/**
 * Fetch site settings (singleton)
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = getSupabase();
  
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch site settings: ${error.message}`);
  }
  return data;
}

/**
 * Transform database records to component-ready format with public URLs
 */
export function transformWorkItem(item: WorkItem) {
  return {
    ...item,
    posterUrl: getPublicUrl(STORAGE_BUCKETS.WORK, item.poster_path),
    posterUrlOptimized: (width: number, quality = 80) => 
      getOptimizedImageUrl(STORAGE_BUCKETS.WORK, item.poster_path, { width, quality, format: 'webp' }),
    videoUrl: item.video_path ? getPublicUrl(STORAGE_BUCKETS.WORK, item.video_path) : null,
  };
}

export function transformHeroSlide(slide: HeroSlide) {
  return {
    ...slide,
    imageUrl: getPublicUrl(STORAGE_BUCKETS.HERO, slide.image_path),
    imageUrlOptimized: (width: number, quality = 80) =>
      getOptimizedImageUrl(STORAGE_BUCKETS.HERO, slide.image_path, { width, quality, format: 'webp' }),
  };
}

export function transformBrand(brand: Brand) {
  return {
    ...brand,
    logoUrl: getPublicUrl(STORAGE_BUCKETS.LOGOS, brand.logo_path),
    logoUrlOptimized: (width: number) =>
      getOptimizedImageUrl(STORAGE_BUCKETS.LOGOS, brand.logo_path, { width, format: 'webp' }),
  };
}

export function transformTeamMember(member: TeamMember) {
  const photoPath = member.photo_path;
  return {
    ...member,
    photoUrl: photoPath ? getPublicUrl(STORAGE_BUCKETS.FOUNDERS, photoPath) : null,
    photoUrlOptimized: photoPath
      ? (width: number) =>
          getOptimizedImageUrl(STORAGE_BUCKETS.FOUNDERS, photoPath, { width, format: 'webp' })
      : null,
  };
}

/**
 * Reel/showreel helpers
 */
export async function getReelVideo() {
  // Assuming single reel video in 'reel' bucket
  return getPublicUrl(STORAGE_BUCKETS.REEL, 'Showreel.mp4');
}

export async function getReelPoster() {
  // Poster frame for reel - could be in hero bucket or dedicated
  return getPublicUrl(STORAGE_BUCKETS.HERO, 'cinematic-2.jpg');
}