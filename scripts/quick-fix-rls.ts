#!/usr/bin/env tsx

/**
 * Quick Fix RLS Script
 * 
 * This script provides a quick workaround by temporarily disabling RLS
 * and then provides instructions for proper policy setup.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function quickFix() {
  console.log('🚀 Quick Fix for Supabase Storage');
  console.log('==================================');
  console.log('');

  console.log('📋 Manual Steps Required:');
  console.log('');
  console.log('1️⃣ Go to your Supabase Dashboard');
  console.log('2️⃣ Navigate to Storage → Settings');
  console.log('3️⃣ For each bucket (images, videos, files):');
  console.log('   - Click on the bucket name');
  console.log('   - Go to "Settings" tab');
  console.log('   - Toggle OFF "Enable RLS"');
  console.log('   - Click "Save"');
  console.log('');

  console.log('⚠️  IMPORTANT: This disables security!');
  console.log('   - Only use this for testing/development');
  console.log('   - Re-enable RLS and set up proper policies for production');
  console.log('');

  console.log('🔧 For Production - Set up RLS Policies:');
  console.log('========================================');
  console.log('');
  console.log('1. Go to Storage → Policies');
  console.log('2. For each bucket, create these policies:');
  console.log('');

  const buckets = ['images', 'videos', 'files'];
  
  for (const bucket of buckets) {
    console.log(`📁 Bucket: ${bucket}`);
    console.log('   Policy 1: Public Read');
    console.log('   - Name: "Public read access"');
    console.log('   - Operation: SELECT');
    console.log('   - Target: public');
    console.log(`   - USING: bucket_id = '${bucket}'`);
    console.log('');
    
    console.log('   Policy 2: Public Upload');
    console.log('   - Name: "Public upload access"');
    console.log('   - Operation: INSERT');
    console.log('   - Target: public');
    console.log(`   - WITH CHECK: bucket_id = '${bucket}'`);
    console.log('');
    
    console.log('   Policy 3: Public Update');
    console.log('   - Name: "Public update access"');
    console.log('   - Operation: UPDATE');
    console.log('   - Target: public');
    console.log(`   - USING: bucket_id = '${bucket}'`);
    console.log('');
    
    console.log('   Policy 4: Public Delete');
    console.log('   - Name: "Public delete access"');
    console.log('   - Operation: DELETE');
    console.log('   - Target: public');
    console.log(`   - USING: bucket_id = '${bucket}'`);
    console.log('');
  }

  console.log('🧪 Test the fix:');
  console.log('================');
  console.log('Run: bun run debug-buckets');
  console.log('You should see ✅ for all upload tests');
  console.log('');

  console.log('🔒 Re-enable RLS for Production:');
  console.log('================================');
  console.log('1. Go back to Storage → Settings');
  console.log('2. For each bucket, toggle ON "Enable RLS"');
  console.log('3. Make sure the policies above are created');
  console.log('4. Test uploads again to ensure they still work');
}

quickFix().catch(console.error);
