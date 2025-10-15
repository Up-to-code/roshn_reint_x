#!/usr/bin/env tsx

/**
 * Fix Supabase RLS Policies Script
 * 
 * This script creates the necessary RLS policies to allow public uploads
 * to the storage buckets.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const BUCKETS = ['images', 'videos', 'files'];

async function createRLSPolicies() {
  console.log('🔧 Fixing Supabase RLS Policies');
  console.log('================================');
  console.log('');

  for (const bucketName of BUCKETS) {
    console.log(`📁 Setting up policies for bucket '${bucketName}'...`);
    
    try {
      // Policy 1: Allow public read access
      const { error: readError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE POLICY IF NOT EXISTS "Public read access for ${bucketName}" 
          ON storage.objects 
          FOR SELECT 
          USING (bucket_id = '${bucketName}');
        `
      });
      
      if (readError) {
        console.log(`   ⚠️  Read policy might already exist: ${readError.message}`);
      } else {
        console.log(`   ✅ Read policy created for '${bucketName}'`);
      }

      // Policy 2: Allow public upload
      const { error: insertError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE POLICY IF NOT EXISTS "Public upload access for ${bucketName}" 
          ON storage.objects 
          FOR INSERT 
          WITH CHECK (bucket_id = '${bucketName}');
        `
      });
      
      if (insertError) {
        console.log(`   ⚠️  Upload policy might already exist: ${insertError.message}`);
      } else {
        console.log(`   ✅ Upload policy created for '${bucketName}'`);
      }

      // Policy 3: Allow public update
      const { error: updateError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE POLICY IF NOT EXISTS "Public update access for ${bucketName}" 
          ON storage.objects 
          FOR UPDATE 
          USING (bucket_id = '${bucketName}');
        `
      });
      
      if (updateError) {
        console.log(`   ⚠️  Update policy might already exist: ${updateError.message}`);
      } else {
        console.log(`   ✅ Update policy created for '${bucketName}'`);
      }

      // Policy 4: Allow public delete
      const { error: deleteError } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE POLICY IF NOT EXISTS "Public delete access for ${bucketName}" 
          ON storage.objects 
          FOR DELETE 
          USING (bucket_id = '${bucketName}');
        `
      });
      
      if (deleteError) {
        console.log(`   ⚠️  Delete policy might already exist: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Delete policy created for '${bucketName}'`);
      }

    } catch (err) {
      console.error(`   ❌ Error setting up policies for '${bucketName}':`, err);
    }
    
    console.log('');
  }

  console.log('🎉 RLS Policy Setup Complete!');
  console.log('');
  console.log('📋 Manual Setup Instructions (if script failed):');
  console.log('================================================');
  console.log('');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to Storage > Policies');
  console.log('3. For each bucket (images, videos, files), create these policies:');
  console.log('');
  
  for (const bucketName of BUCKETS) {
    console.log(`📁 Bucket: ${bucketName}`);
    console.log('   Policy Name: Public read access');
    console.log('   Operation: SELECT');
    console.log(`   Target roles: public`);
    console.log(`   USING expression: bucket_id = '${bucketName}'`);
    console.log('');
    console.log('   Policy Name: Public upload access');
    console.log('   Operation: INSERT');
    console.log(`   Target roles: public`);
    console.log(`   WITH CHECK expression: bucket_id = '${bucketName}'`);
    console.log('');
    console.log('   Policy Name: Public update access');
    console.log('   Operation: UPDATE');
    console.log(`   Target roles: public`);
    console.log(`   USING expression: bucket_id = '${bucketName}'`);
    console.log('');
    console.log('   Policy Name: Public delete access');
    console.log('   Operation: DELETE');
    console.log(`   Target roles: public`);
    console.log(`   USING expression: bucket_id = '${bucketName}'`);
    console.log('');
  }
}

// Run the script
createRLSPolicies().catch(console.error);
