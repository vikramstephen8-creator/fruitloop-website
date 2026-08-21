#!/usr/bin/env tsx
/**
 * Create Supabase Storage buckets
 * Run: npx tsx scripts/create-buckets.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BUCKETS = [
  { id: 'hero', name: 'hero', public: true },
  { id: 'work', name: 'work', public: true },
  { id: 'logos', name: 'logos', public: true },
  { id: 'reel', name: 'reel', public: true },
  { id: 'founders', name: 'founders', public: true },
];

async function createBuckets() {
  console.log('🪣 Creating storage buckets...\n');
  
  for (const bucket of BUCKETS) {
    const { data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ⚠️  ${bucket.id} already exists`);
      } else {
        console.error(`  ❌ ${bucket.id}: ${error.message}`);
      }
    } else {
      console.log(`  ✅ Created bucket: ${bucket.id} (public: ${bucket.public})`);
    }
  }
  
  // List all buckets to verify
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('\n📦 Current buckets:');
  buckets?.forEach(b => console.log(`  - ${b.name} (public: ${b.public})`));
}

createBuckets().catch(console.error);