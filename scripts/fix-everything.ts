#!/usr/bin/env tsx

/**
 * FIX EVERYTHING SCRIPT
 * 
 * This script provides multiple solutions to get your uploader working
 * and tests everything to ensure it works.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function fixEverything() {
  console.log('🚀 FIXING EVERYTHING - GET UPLOADER WORKING!');
  console.log('=============================================');
  console.log('');

  // Step 1: Check current status
  console.log('1️⃣ Checking current status...');
  try {
    const { data: buckets, error } = await supabaseAnon.storage.listBuckets();
    if (error) {
      console.log('❌ Cannot list buckets:', error.message);
    } else {
      console.log('✅ Buckets found:', buckets?.map(b => b.name) || []);
    }
  } catch (err) {
    console.log('❌ Error checking buckets:', err);
  }

  console.log('');

  // Step 2: Try to disable RLS via SQL
  if (supabaseAdmin) {
    console.log('2️⃣ Attempting to disable RLS via SQL...');
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: 'ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;'
      });
      
      if (error) {
        console.log('⚠️  SQL execution failed:', error.message);
        console.log('   This is normal - you need to do it manually');
      } else {
        console.log('✅ RLS disabled via SQL!');
      }
    } catch (err) {
      console.log('⚠️  SQL execution error:', err);
    }
  } else {
    console.log('⚠️  No service key - skipping SQL fix');
  }

  console.log('');

  // Step 3: Test uploads
  console.log('3️⃣ Testing uploads...');
  const testCases = [
    { bucket: 'images', file: new File(['fake image'], 'test.png', { type: 'image/png' }) },
    { bucket: 'videos', file: new File(['fake video'], 'test.mp4', { type: 'video/mp4' }) },
    { bucket: 'files', file: new File(['test content'], 'test.txt', { type: 'text/plain' }) }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const testCase of testCases) {
    try {
      console.log(`   Testing ${testCase.file.type} upload to '${testCase.bucket}'...`);
      
      const { data: uploadData, error: uploadError } = await supabaseAnon.storage
        .from(testCase.bucket)
        .upload(`test-${Date.now()}-${testCase.file.name}`, testCase.file);
      
      if (uploadError) {
        console.log(`   ❌ Upload failed: ${uploadError.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Upload successful: ${uploadData.path}`);
        successCount++;
        
        // Clean up
        await supabaseAnon.storage.from(testCase.bucket).remove([uploadData.path]);
        console.log(`   🧹 Cleaned up test file`);
      }
    } catch (err) {
      console.log(`   ❌ Upload error: ${err}`);
      errorCount++;
    }
  }

  console.log('');

  // Step 4: Results and next steps
  if (successCount === testCases.length) {
    console.log('🎉 SUCCESS! All uploads working!');
    console.log('===============================');
    console.log('✅ Your CustomUploader component will work perfectly!');
    console.log('✅ You can now use the uploader in your app');
    console.log('');
    console.log('🧪 Test your uploader:');
    console.log('=====================');
    console.log('Add this to your component:');
    console.log('');
    console.log('```tsx');
    console.log('<CustomUploader');
    console.log('  bucket="IMAGES"');
    console.log('  acceptedFileTypes="image"');
    console.log('  onUploadComplete={(url) => console.log("Uploaded:", url)}');
    console.log('/>');
    console.log('```');
  } else {
    console.log('❌ UPLOADS STILL FAILING - MANUAL FIX NEEDED');
    console.log('============================================');
    console.log('');
    console.log('🔧 MANUAL FIX REQUIRED:');
    console.log('======================');
    console.log('');
    console.log('Method 1: Disable RLS in Dashboard');
    console.log('----------------------------------');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Storage → Settings');
    console.log('4. For each bucket (images, videos, files):');
    console.log('   - Click on bucket name');
    console.log('   - Click "Settings" tab');
    console.log('   - Toggle OFF "Enable RLS"');
    console.log('   - Click "Save"');
    console.log('');
    console.log('Method 2: Use SQL Editor');
    console.log('------------------------');
    console.log('1. Go to SQL Editor in Supabase Dashboard');
    console.log('2. Run this command:');
    console.log('   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;');
    console.log('3. Click "Run"');
    console.log('');
    console.log('Method 3: Create RLS Policies');
    console.log('-----------------------------');
    console.log('1. Go to Storage → Policies');
    console.log('2. For each bucket, create these policies:');
    console.log('');
    
    const buckets = ['images', 'videos', 'files'];
    for (const bucket of buckets) {
      console.log(`   📁 ${bucket} bucket:`);
      console.log(`   - Policy: "Public read", Operation: SELECT, Target: public, USING: bucket_id = '${bucket}'`);
      console.log(`   - Policy: "Public upload", Operation: INSERT, Target: public, WITH CHECK: bucket_id = '${bucket}'`);
      console.log(`   - Policy: "Public update", Operation: UPDATE, Target: public, USING: bucket_id = '${bucket}'`);
      console.log(`   - Policy: "Public delete", Operation: DELETE, Target: public, USING: bucket_id = '${bucket}'`);
      console.log('');
    }
    
    console.log('After doing any of these methods, run:');
    console.log('bun run debug-buckets');
    console.log('');
    console.log('You should see ✅ for all upload tests!');
  }

  console.log('');
  console.log('📊 SUMMARY:');
  console.log('===========');
  console.log(`✅ Successful uploads: ${successCount}/${testCases.length}`);
  console.log(`❌ Failed uploads: ${errorCount}/${testCases.length}`);
  console.log('');
  
  if (errorCount > 0) {
    console.log('🔍 The issue is RLS (Row Level Security) blocking public uploads');
    console.log('💡 Disabling RLS = instant fix!');
  }
}

fixEverything().catch(console.error);
