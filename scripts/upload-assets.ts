#!/usr/bin/env tsx
/**
 * Upload all public/assets to Supabase Storage
 * Run: npx tsx scripts/upload-assets.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BUCKET_MAP: Record<string, string> = {
  hero: 'hero',
  work: 'work',
  logos: 'logos',
  reel: 'reel',
};

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');

async function uploadDir(localDir: string, bucket: string, prefix = '') {
  const files = fs.readdirSync(localDir);
  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    if (file === '.DS_Store') continue;
    
    const fullPath = path.join(localDir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const subUploaded = await uploadDir(fullPath, bucket, `${prefix}${file}/`);
      uploaded += subUploaded;
    } else {
      const content = fs.readFileSync(fullPath);
      const contentType = mime.lookup(file) || 'application/octet-stream';
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${prefix}${file}`, content, {
          contentType,
          upsert: true,
          cacheControl: '31536000', // 1 year
        });
      
      if (error) {
        console.error(`  ❌ ${bucket}/${prefix}${file}: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ ${bucket}/${prefix}${file} (${(stat.size / 1024).toFixed(1)} KB)`);
        uploaded++;
      }
    }
  }
  return uploaded;
}

async function main() {
  console.log('🚀 Starting asset upload to Supabase Storage...\n');
  
  let totalUploaded = 0;
  
  for (const [localFolder, bucket] of Object.entries(BUCKET_MAP)) {
    const localPath = path.join(ASSETS_DIR, localFolder);
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  Skipping ${localFolder} (not found)`);
      continue;
    }
    
    console.log(`📁 Uploading ${localFolder} → bucket: ${bucket}`);
    const count = await uploadDir(localPath, bucket);
    totalUploaded += count;
    console.log(`   → ${count} files uploaded\n`);
  }
  
  console.log(`✨ Done! Total uploaded: ${totalUploaded} files`);
  
  // List bucket contents to verify
  for (const bucket of Object.values(BUCKET_MAP)) {
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 100 });
    if (!error && data) {
      console.log(`\n📦 ${bucket}: ${data.length} objects`);
    }
  }
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});