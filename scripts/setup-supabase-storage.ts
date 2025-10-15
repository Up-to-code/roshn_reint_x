#!/usr/bin/env tsx

/**
 * Supabase Storage Setup Script
 * 
 * This script creates the required storage buckets for the application.
 * Run this script after setting up your Supabase project and environment variables.
 * 
 * Usage:
 *   npx tsx scripts/setup-supabase-storage.ts
 *   or
 *   bun run scripts/setup-supabase-storage.ts
 */

import { setupSupabaseStorage } from '../lib/supabase-setup';

async function main() {
  console.log('🔧 Supabase Storage Setup Script');
  console.log('================================');
  
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('');
    console.error('Please add these to your .env.local file and try again.');
    console.error('');
    console.error('To get your service role key:');
    console.error('1. Go to your Supabase project dashboard');
    console.error('2. Navigate to Settings > API');
    console.error('3. Copy the "service_role" key (not the anon key)');
    process.exit(1);
  }
  
  console.log('✅ Environment variables found');
  console.log('');
  
  try {
    const result = await setupSupabaseStorage();
    
    if (result.success) {
      console.log('');
      console.log('🎉 Setup completed successfully!');
      console.log('');
      console.log('Your storage buckets are ready to use:');
      console.log('   📁 images - for image files (5MB limit)');
      console.log('   📁 videos - for video files (50MB limit)');
      console.log('   📁 files - for other files (10MB limit)');
      console.log('');
      console.log('You can now use the CustomUploader component in your app!');
    } else {
      console.log('');
      console.error('❌ Setup failed:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('');
    console.error('❌ Unexpected error during setup:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
