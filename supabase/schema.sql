-- ============================================================
-- FRUITLOOP SUPABASE DATABASE SCHEMA
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- STORAGE BUCKETS (run via Storage UI or SQL)
-- ============================================================
-- These can also be created via Dashboard → Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('hero', 'hero', true),
--   ('work', 'work', true),
--   ('logos', 'logos', true),
--   ('reel', 'reel', true),
--   ('founders', 'founders', true);

-- ============================================================
-- TABLES
-- ============================================================

-- 1. WORK ITEMS
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ad', 'food', 'hospitality')),
  title TEXT NOT NULL,
  description TEXT,
  poster_path TEXT NOT NULL,
  video_path TEXT,
  case_study_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HERO SLIDES
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subheadline TEXT,
  image_path TEXT NOT NULL,
  cta_text TEXT,
  cta_href TEXT,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  icon_name TEXT,
  color_token TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM MEMBERS
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_path TEXT,
  social_links JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BRANDS
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  website_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS (singleton)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Fruitloop',
  tagline TEXT,
  contact_email TEXT,
  phone_numbers JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  seo_defaults JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_work_items_category ON work_items(category);
CREATE INDEX idx_work_items_featured ON work_items(featured) WHERE featured;
CREATE INDEX idx_work_items_published ON work_items(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_work_items_slug ON work_items(slug);
CREATE INDEX idx_hero_slides_active ON hero_slides(active) WHERE active;
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_brands_featured ON brands(featured) WHERE featured;
CREATE INDEX idx_brands_category ON brands(category);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon key)
CREATE POLICY "Public read published work" ON work_items
  FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Public read active hero slides" ON hero_slides
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Public read services" ON services
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read team members" ON team_members
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read brands" ON brands
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (TRUE);

-- Service role full access (admin)
CREATE POLICY "Service role full access work_items" ON work_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access hero_slides" ON hero_slides
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access services" ON services
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access team_members" ON team_members
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access brands" ON brands
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read for all Fruitloop buckets
CREATE POLICY "Public read hero" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero');

CREATE POLICY "Public read work" ON storage.objects
  FOR SELECT USING (bucket_id = 'work');

CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Public read reel" ON storage.objects
  FOR SELECT USING (bucket_id = 'reel');

CREATE POLICY "Public read founders" ON storage.objects
  FOR SELECT USING (bucket_id = 'founders');

-- Admin upload via service role
CREATE POLICY "Service role upload hero" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero' AND auth.role() = 'service_role');

CREATE POLICY "Service role upload work" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'work' AND auth.role() = 'service_role');

CREATE POLICY "Service role upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'service_role');

CREATE POLICY "Service role upload reel" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reel' AND auth.role() = 'service_role');

CREATE POLICY "Service role upload founders" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'founders' AND auth.role() = 'service_role');

-- Service role update/delete
CREATE POLICY "Service role manage all storage" ON storage.objects
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_work_items_updated_at BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA (run after tables created)
-- ============================================================

-- Site Settings
INSERT INTO site_settings (id, site_name, tagline, contact_email, phone_numbers, social_links, seo_defaults) VALUES
(1, 'Fruitloop', 'Independent 360° Creative Agency', 'fruitloopdelhi@gmail.com',
 '[{"label": "Call", "value": "+91 97119 70285", "href": "tel:+919711970285"}, {"label": "Call", "value": "+91 95605 87991", "href": "tel:+919560587991"}]'::jsonb,
 '{"instagram": "https://instagram.com/fruitloop", "linkedin": "https://linkedin.com/company/fruitloop"}'::jsonb,
 '{"title": "Fruitloop — Independent 360° Creative Agency", "description": "Concept development, pre to post production, brand content and content strategy that turns brand stories into scroll-stopping content."}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  tagline = EXCLUDED.tagline,
  contact_email = EXCLUDED.contact_email,
  phone_numbers = EXCLUDED.phone_numbers,
  social_links = EXCLUDED.social_links,
  seo_defaults = EXCLUDED.seo_defaults,
  updated_at = NOW();

-- Services
INSERT INTO services (slug, title, short_description, long_description, icon_name, color_token, sort_order) VALUES
('concept-development', 'Concept Development', 'From "let''s just stick to the basics?" to "what if the CEO does parkour?"', 'We take vague briefs and turn them into sharp, executable creative concepts. Strategy-first, always.', 'lightbulb', 'yellow', 1),
('pre-to-post-production', 'Pre to Post Production', 'Lights, camera, banana action. We film, snap, and record everything from sassy shorts to full-on brand sagas.', 'End-to-end production: pre-production planning, shoot management, editing, color grading, sound design, final delivery.', 'camera', 'orange', 2),
('brand-content', 'Brand Content', 'Campaigns, product launches, and those weird-but-viral videos your competitors wish they made.', 'Social-first content, brand films, product showcases, influencer collaborations, UGC campaigns.', 'palette', 'lime', 3),
('content-strategy', 'Content Strategy', 'We get your brand in all the right places… and some you didn''t even know existed.', 'Content audits, platform strategy, content calendars, distribution planning, performance analytics.', 'bar-chart', 'orange-deep', 4)
ON CONFLICT (slug) DO NOTHING;

-- Hero Slides (map from current cinematic-1..4.jpg)
INSERT INTO hero_slides (headline, subheadline, image_path, cta_text, cta_href, active, sort_order) VALUES
('TURN THE MUNDANE INTO MEMORABLE.', 'Let''s face it — nobody wants another boring content factory.', 'cinematic-1.jpg', 'Let''s Collaborate', '#contact', true, 1),
('BE SEEN. BE HEARD. ACTUALLY RESONATE.', 'Instead of blending in.', 'cinematic-2.jpg', 'Watch the Showreel', '#reel', true, 2),
('FOUR DISCIPLINES. ONE LOOP.', 'Concept Development, Pre to Post Production, Brand Content, Content Strategy.', 'cinematic-3.jpg', 'What We Do', '#services', true, 3),
('CAMPAIGNS THAT DON''T JUST BREAK THE INTERNET.', 'They rewire it.', 'cinematic-4.jpg', 'See Our Work', '#work', true, 4)
ON CONFLICT DO NOTHING;

-- Team Members (Founders)
INSERT INTO team_members (name, role, bio, photo_path, social_links, sort_order) VALUES
('Vikram Stephen Singh', 'Co-Founder — Strategy & Culture', 'Part spreadsheet, part stand-up comic, all strategy. Vikram can spot a trend before it''s cool and meme your campaign into the stratosphere — all without breaking a sweat or a punchline.', 'founder-vikram.jpg', '{"linkedin": "https://linkedin.com/in/vikramstephensingh"}'::jsonb, 1),
('Pratik Oscar Kelvin Minj', 'Co-Founder — Production', 'Call him "the fixer." Broken dolly? Rain on shoot day? Pratik handles it with zero sweat and impeccable hair. If you want your vision brought to life without a hitch, he''s your ringleader.', 'founder-pratik.jpg', '{"linkedin": "https://linkedin.com/in/pratikminj"}'::jsonb, 2)
ON CONFLICT DO NOTHING;

-- Brands (Logos - map from logo-00..21.png)
INSERT INTO brands (name, logo_path, website_url, category, featured, sort_order) VALUES
('Brand 1', 'logo-00.png', null, null, true, 1),
('Brand 2', 'logo-01.png', null, null, true, 2),
('Brand 3', 'logo-02.png', null, null, true, 3),
('Brand 4', 'logo-03.png', null, null, true, 4),
('Brand 5', 'logo-04.png', null, null, true, 5),
('Brand 6', 'logo-05.png', null, null, true, 6),
('Brand 7', 'logo-06.png', null, null, true, 7),
('Brand 8', 'logo-07.png', null, null, true, 8),
('Brand 9', 'logo-08.png', null, null, true, 9),
('Brand 10', 'logo-09.png', null, null, true, 10),
('Brand 11', 'logo-10.png', null, null, true, 11),
('Brand 12', 'logo-11.png', null, null, true, 12),
('Brand 13', 'logo-12.png', null, null, true, 13),
('Brand 14', 'logo-13.png', null, null, true, 14),
('Brand 15', 'logo-14.png', null, null, true, 15),
('Brand 16', 'logo-15.png', null, null, true, 16),
('Brand 17', 'logo-16.png', null, null, true, 17),
('Brand 18', 'logo-17.png', null, null, true, 18),
('Brand 19', 'logo-18.png', null, null, true, 19),
('Brand 20', 'logo-19.png', null, null, true, 20),
('Brand 21', 'logo-20.png', null, null, true, 21),
('Brand 22', 'logo-21.png', null, null, true, 22)
ON CONFLICT DO NOTHING;

-- Work Items (map from current WORK_ITEMS)
-- Note: Update poster_path after uploading assets to storage
INSERT INTO work_items (slug, category, title, description, poster_path, video_path, case_study_url, tags, featured, sort_order, published_at) VALUES
-- Ad Campaign
('product-launch-film', 'ad', 'Product Launch Film', 'High-impact product launch film for perfume brand', 'ad-campaign-1.jpg', null, 'https://example.com/case-study/product-launch-film', '{"film", "product", "perfume"}', true, 1, NOW()),
('brand-hero-shot', 'ad', 'Brand Hero Shot', 'Hero brand imagery for campaign rollout', 'ad-campaign-2.jpg', null, 'https://example.com/case-study/brand-hero-shot', '{"photography", "hero", "branding"}', true, 2, NOW()),
('lifestyle-story', 'ad', 'Lifestyle Story', 'Lifestyle narrative film for brand campaign', 'ad-campaign-3.jpg', null, 'https://example.com/case-study/lifestyle-story', '{"film", "lifestyle", "storytelling"}', false, 3, NOW()),
('colour-campaign', 'ad', 'Colour Campaign', 'Vibrant colour-focused ad campaign', 'ad-campaign-4.jpg', null, 'https://example.com/case-study/colour-campaign', '{"film", "colour", "campaign"}', false, 4, NOW()),
-- Food
('menu-launch', 'food', 'Menu Launch', 'Menu launch content for restaurant', 'food-1.jpg', null, 'https://example.com/case-study/menu-launch', '{"photography", "food", "menu"}', true, 5, NOW()),
('dessert-feature', 'food', 'Dessert Feature', 'Dessert hero shots and film', 'food-2.jpg', null, 'https://example.com/case-study/dessert-feature', '{"photography", "dessert", "food"}', false, 6, NOW()),
('bakery-content', 'food', 'Bakery Content', 'Artisan bakery brand content series', 'food-3.jpg', null, 'https://example.com/case-study/bakery-content', '{"photography", "bakery", "branding"}', false, 7, NOW()),
('cafe-brand-film', 'food', 'Cafe Brand Film', 'Brand film for specialty cafe', 'food-4.jpg', null, 'https://example.com/case-study/cafe-brand-film', '{"film", "cafe", "branding"}', false, 8, NOW()),
-- Hospitality
('resort-high-tea', 'hospitality', 'Resort High Tea', 'Luxury resort high tea experience film', 'hospitality-1.jpg', null, 'https://example.com/case-study/resort-high-tea', '{"film", "hospitality", "luxury"}', true, 9, NOW()),
('spa-wellness', 'hospitality', 'Spa & Wellness', 'Spa and wellness retreat content', 'hospitality-2.jpg', null, 'https://example.com/case-study/spa-wellness', '{"photography", "spa", "wellness"}', false, 10, NOW()),
('taj-theog-resort-spa', 'hospitality', 'Taj Theog Resort & Spa', 'Comprehensive resort brand film for Taj Theog', 'hospitality-3.jpg', null, 'https://example.com/case-study/taj-theog', '{"film", "hospitality", "luxury", "resort"}', true, 11, NOW()),
('bar-menu-film', 'hospitality', 'Bar Menu Film', 'Signature cocktail bar menu film', 'hospitality-4.jpg', null, 'https://example.com/case-study/bar-menu-film', '{"film", "bar", "cocktails"}', false, 12, NOW())
ON CONFLICT (slug) DO NOTHING;