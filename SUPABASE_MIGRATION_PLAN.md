# Fruitloop → Supabase Migration Plan

## Overview
Migrate static assets (images, video, logos) to **Supabase Storage** and create a **PostgreSQL database** for dynamic content management.

---

## 1. Supabase Project Setup

```bash
# Login with your access token (generate at supabase.com/dashboard/account/tokens)
supabase login --token <YOUR_ACCESS_TOKEN>

# Link to existing project OR create new
supabase link --project-ref <YOUR_PROJECT_REF>

# Or create new project
supabase projects create fruitloop-website --region ap-south-1
```

### Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # Server-side only
```

> **Never commit secrets.** Add `.env.local` to `.gitignore`.

---

## 2. Storage Buckets Structure

| Bucket | Public | Purpose | Cache-Control |
|--------|--------|---------|---------------|
| `hero` | ✅ | Hero section images (cinematic-1..4.jpg) | `public, max-age=31536000, immutable` |
| `work` | ✅ | Work grid images (ad, food, hospitality, extra) | `public, max-age=31536000, immutable` |
| `logos` | ✅ | Client logo marquee (logo-00..21.png) | `public, max-age=31536000, immutable` |
| `reel` | ✅ | Showreel video (Showreel.mp4) | `public, max-age=31536000, immutable` |
| `founders` | ✅ | Founder photos (future) | `public, max-age=31536000, immutable` |

### Bucket Policies (SQL)
```sql
-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Public read for all buckets
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id IN ('hero', 'work', 'logos', 'reel', 'founders'));

-- Authenticated upload (admin only via service role)
CREATE POLICY "Admin upload" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

---

## 3. Asset Migration Script

Create `scripts/upload-assets.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');

async function uploadDir(bucket: string, dir: string, prefix = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await uploadDir(bucket, fullPath, `${prefix}${file}/`);
    } else {
      const content = fs.readFileSync(fullPath);
      const contentType = mime.lookup(file) || 'application/octet-stream';
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${prefix}${file}`, content, {
          contentType,
          upsert: true,
          cacheControl: '31536000',
        });
      if (error) console.error(`Failed ${bucket}/${prefix}${file}:`, error.message);
      else console.log(`✅ ${bucket}/${prefix}${file}`);
    }
  }
}

async function main() {
  await uploadDir('hero', path.join(ASSETS_DIR, 'hero'));
  await uploadDir('work', path.join(ASSETS_DIR, 'work'));
  await uploadDir('logos', path.join(ASSETS_DIR, 'logos'));
  await uploadDir('reel', path.join(ASSETS_DIR, 'reel'));
}

main().catch(console.error);
```

Run:
```bash
npx tsx scripts/upload-assets.ts
```

---

## 4. Database Schema (Dynamic Pages)

### Tables

```sql
-- 1. Work Items (replaces WORK_ITEMS in lib/data.ts)
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,           -- e.g., "product-launch-film"
  category TEXT NOT NULL CHECK (category IN ('ad', 'food', 'hospitality')),
  title TEXT NOT NULL,
  description TEXT,
  poster_path TEXT NOT NULL,           -- Supabase storage path: work/ad/product-launch.jpg
  video_path TEXT,                     -- Optional: work/ad/product-launch.mp4
  case_study_url TEXT,                 -- External case study link
  tags TEXT[],                         -- ['branding', 'film', 'social']
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hero Slides (for rotating hero content)
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subheadline TEXT,
  image_path TEXT NOT NULL,            -- hero/slide-1.jpg
  cta_text TEXT,
  cta_href TEXT,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0
);

-- 3. Services (replaces SERVICES.items)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  icon_name TEXT,                      -- Lucide icon name or custom SVG path
  color_token TEXT,                    -- 'yellow' | 'orange' | 'lime' | 'orange-deep'
  sort_order INT DEFAULT 0
);

-- 4. Founders/Team
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_path TEXT,                     -- founders/vikram.jpg
  social_links JSONB,                  -- { "linkedin": "...", "twitter": "..." }
  sort_order INT DEFAULT 0
);

-- 5. Brands/Clients (for logo marquee)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_path TEXT NOT NULL,             -- logos/logo-acme.png
  website_url TEXT,
  category TEXT,                       -- 'tech', 'hospitality', 'fmcg', etc.
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- 6. Site Settings (singleton)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Fruitloop',
  tagline TEXT,
  contact_email TEXT,
  phone_numbers JSONB,
  social_links JSONB,
  seo_defaults JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes & RLS

```sql
-- Indexes
CREATE INDEX idx_work_items_category ON work_items(category);
CREATE INDEX idx_work_items_featured ON work_items(featured) WHERE featured;
CREATE INDEX idx_work_items_published ON work_items(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_brands_featured ON brands(featured) WHERE featured;

-- RLS Policies
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published work" ON work_items
FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Public read active hero" ON hero_slides
FOR SELECT USING (active = TRUE);

CREATE POLICY "Public read services" ON services
FOR SELECT USING (TRUE);

CREATE POLICY "Public read team" ON team_members
FOR SELECT USING (TRUE);

CREATE POLICY "Public read brands" ON brands
FOR SELECT USING (TRUE);

CREATE POLICY "Public read settings" ON site_settings
FOR SELECT USING (TRUE);

-- Admin write via service role
CREATE POLICY "Service role full access" ON work_items
FOR ALL USING (auth.role() = 'service_role');
-- Repeat for other tables...
```

---

## 5. Next.js Integration

### `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

### `lib/data.ts` → Dynamic Versions

```typescript
// lib/data.ts (new dynamic version)
import { supabase } from './supabase';

export async function getWorkItems(category?: string) {
  let query = supabase
    .from('work_items')
    .select('*')
    .not('published_at', 'is', null)
    .order('sort_order', { ascending: true });
  
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getHeroSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  return data;
}

// ... similar for services, team, brands, settings
```

### Storage URL Helpers
```typescript
// lib/storage.ts
import { supabase } from './supabase';

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Usage: getPublicUrl('work', 'ad/product-launch.jpg')
```

---

## 6. Migration Steps Checklist

### Phase 1: Infrastructure
- [ ] Create Supabase project
- [ ] Add env vars to `.env.local` and Vercel/Netlify
- [ ] Run SQL schema (via Supabase Dashboard → SQL Editor)
- [ ] Create storage buckets with policies

### Phase 2: Asset Upload
- [ ] Run `scripts/upload-assets.ts`
- [ ] Verify all assets accessible via public URLs
- [ ] Test image optimization (Supabase Image Transform: `?width=800&quality=80`)

### Phase 3: Data Migration
- [ ] Seed `work_items` from current `WORK_ITEMS` + add slugs, descriptions
- [ ] Seed `hero_slides` from current hero images
- [ ] Seed `services` from current SERVICES
- [ ] Seed `team_members` from FOUNDERS
- [ ] Seed `brands` from current logo list
- [ ] Seed `site_settings` from SITE + CONTACT

### Phase 4: Code Refactor
- [ ] Update `lib/data.ts` to fetch from Supabase (with fallback to static for build)
- [ ] Update components to use dynamic data (async Server Components)
- [ ] Add ISR revalidation (`export const revalidate = 3600`)
- [ ] Update `Work.tsx` filter to work with DB categories

### Phase 5: Admin/CMS (Optional Future)
- [ ] Build simple admin UI at `/admin` (protected by auth)
- [ ] Add image upload to storage via signed URLs
- [ ] Content editing forms for work items, services, etc.

---

## 7. Rollback Plan

Keep current static `lib/data.ts` as fallback. Use feature flag:

```typescript
// lib/data-source.ts
export const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export async function getWorkItems() {
  if (USE_SUPABASE) return getWorkItemsFromDB();
  return import('./data-static').then(m => m.WORK_ITEMS);
}
```

---

## 8. Cost Estimate (Supabase Free Tier)

| Resource | Limit | Fruitloop Usage |
|----------|-------|-----------------|
| Database | 500 MB | ~1 MB (tiny) |
| Storage | 1 GB | ~200 MB (images + video) |
| Bandwidth | 2 GB/mo | ~500 MB/mo |
| API Requests | 50k/mo | ~5k/mo |

**Well within free tier.**

---

## 9. Next Steps

1. **Create Supabase project** (or share project ref if existing)
2. **Run schema SQL** in Supabase Dashboard
3. **Add env vars** locally and in deployment
4. **Run upload script** to migrate assets
5. **Seed database** with current content
6. **Refactor components** to use dynamic data

Want me to start with any specific phase?