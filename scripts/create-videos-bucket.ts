#!/usr/bin/env tsx

/**
 * Quick script to create the videos bucket
 * Usage: npx tsx scripts/create-videos-bucket.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  console.error('');
  console.error('Please add these to your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createVideosBucket() {
  console.log('🎬 Creating videos bucket...\n');

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      process.exit(1);
    }

    const bucketExists = buckets?.some(b => b.name === 'videos');
    
    if (bucketExists) {
      console.log('✅ Bucket "videos" already exists!');
      return;
    }

    // Create the videos bucket
    const { data, error } = await supabase.storage.createBucket('videos', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
    });

    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      process.exit(1);
    }

    console.log('✅ Successfully created "videos" bucket!');
    console.log('   - Public: Yes');
    console.log('   - File Size Limit: 50 MB');
    console.log('   - Allowed Types: video/mp4, video/webm, video/ogg, video/avi, video/mov');
    console.log('');
    console.log('🎉 You can now upload videos!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

createVideosBucket().catch(console.error);

