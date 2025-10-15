#!/usr/bin/env tsx

/**
 * Debug Supabase Buckets Script
 * 
 * This script helps debug bucket access issues by checking:
 * - Bucket existence
 * - Bucket permissions
 * - RLS policies
 * - Upload capabilities
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function debugBuckets() {
  console.log('🔍 Debugging Supabase Buckets');
  console.log('==============================');
  console.log('');

  // 1. Check with anon key
  console.log('1️⃣ Checking buckets with anon key...');
  try {
    const { data: anonBuckets, error: anonError } = await supabaseAnon.storage.listBuckets();
    
    if (anonError) {
      console.error('❌ Anon key error:', anonError.message);
    } else {
      console.log('✅ Anon key can list buckets:', anonBuckets?.map(b => b.name) || []);
    }
  } catch (err) {
    console.error('❌ Anon key exception:', err);
  }

  console.log('');

  // 2. Check with service key (if available)
  if (supabaseAdmin) {
    console.log('2️⃣ Checking buckets with service key...');
    try {
      const { data: adminBuckets, error: adminError } = await supabaseAdmin.storage.listBuckets();
      
      if (adminError) {
        console.error('❌ Service key error:', adminError.message);
      } else {
        console.log('✅ Service key can list buckets:', adminBuckets?.map(b => b.name) || []);
      }
    } catch (err) {
      console.error('❌ Service key exception:', err);
    }
  } else {
    console.log('⚠️  Service key not available - skipping admin check');
  }

  console.log('');

  // 3. Test specific bucket access
  const testBuckets = ['images', 'videos', 'files'];
  
  for (const bucketName of testBuckets) {
    console.log(`3️⃣ Testing bucket '${bucketName}'...`);
    
    try {
      // Try to list files in the bucket
      const { data: files, error: listError } = await supabaseAnon.storage
        .from(bucketName)
        .list('', { limit: 1 });
      
      if (listError) {
        console.error(`❌ Cannot access bucket '${bucketName}':`, listError.message);
        
        // Check if it's a permissions issue
        if (listError.message.includes('permission') || listError.message.includes('policy')) {
          console.log(`   💡 This looks like a permissions/RLS policy issue`);
        }
      } else {
        console.log(`✅ Can access bucket '${bucketName}' (${files?.length || 0} files)`);
      }
    } catch (err) {
      console.error(`❌ Exception accessing bucket '${bucketName}':`, err);
    }
  }

  console.log('');

  // 4. Test upload capability
  console.log('4️⃣ Testing upload capability...');
  
  // Test with different file types
  const testCases = [
    { bucket: 'images', file: new File(['fake image'], 'test.png', { type: 'image/png' }) },
    { bucket: 'videos', file: new File(['fake video'], 'test.mp4', { type: 'video/mp4' }) },
    { bucket: 'files', file: new File(['test content'], 'test.txt', { type: 'text/plain' }) }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`   Testing ${testCase.file.type} upload to '${testCase.bucket}'...`);
      
      const { data: uploadData, error: uploadError } = await supabaseAnon.storage
        .from(testCase.bucket)
        .upload(`test-${Date.now()}-${testCase.file.name}`, testCase.file);
      
      if (uploadError) {
        console.error(`   ❌ Upload to '${testCase.bucket}' failed:`, uploadError.message);
      } else {
        console.log(`   ✅ Upload to '${testCase.bucket}' successful:`, uploadData.path);
        
        // Clean up test file
        await supabaseAnon.storage.from(testCase.bucket).remove([uploadData.path]);
        console.log(`   🧹 Test file cleaned up from '${testCase.bucket}'`);
      }
    } catch (err) {
      console.error(`   ❌ Exception uploading to '${testCase.bucket}':`, err);
    }
  }

  console.log('');
  console.log('🔧 Troubleshooting Tips:');
  console.log('========================');
  console.log('1. Make sure buckets are created in your Supabase dashboard');
  console.log('2. Check that buckets are set to "Public"');
  console.log('3. Verify RLS policies allow public access');
  console.log('4. Ensure your anon key has the correct permissions');
  console.log('5. Check that your Supabase project is not paused');
}

// Run the debug script
debugBuckets().catch(console.error);
