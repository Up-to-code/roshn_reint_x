#!/usr/bin/env tsx

/**
 * Supabase Storage Bucket Management Script
 * 
 * This script allows you to create, list, update, and delete Supabase storage buckets.
 * 
 * Usage:
 *   npx tsx scripts/manage-buckets.ts list
 *   npx tsx scripts/manage-buckets.ts create --name videos --public --sizeLimit 52428800
 *   npx tsx scripts/manage-buckets.ts delete --name videos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please add these to your .env.local file and try again.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Default bucket configurations
const DEFAULT_BUCKETS = [
  {
    name: 'images',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  {
    name: 'videos',
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
  },
  {
    name: 'files',
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['*/*']
  }
];

async function listBuckets() {
  console.log('📋 Listing all storage buckets...\n');
  
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error listing buckets:', error.message);
    process.exit(1);
  }

  if (!buckets || buckets.length === 0) {
    console.log('No buckets found.');
    return;
  }

  console.log(`Found ${buckets.length} bucket(s):\n`);
  
  buckets.forEach((bucket, index) => {
    console.log(`${index + 1}. ${bucket.name}`);
    console.log(`   Public: ${bucket.public ? 'Yes' : 'No'}`);
    console.log(`   Created: ${bucket.created_at || 'Unknown'}`);
    console.log(`   Updated: ${bucket.updated_at || 'Unknown'}`);
    if (bucket.file_size_limit) {
      console.log(`   File Size Limit: ${(bucket.file_size_limit / 1024 / 1024).toFixed(2)} MB`);
    }
    if (bucket.allowed_mime_types && bucket.allowed_mime_types.length > 0) {
      console.log(`   Allowed MIME Types: ${bucket.allowed_mime_types.join(', ')}`);
    }
    console.log('');
  });
}

async function createBucket(name: string, options: {
  public?: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
} = {}) {
  console.log(`🔨 Creating bucket '${name}'...\n`);

  // Check if bucket already exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === name);

  if (exists) {
    console.log(`⚠️  Bucket '${name}' already exists.`);
    return;
  }

  const { data, error } = await supabase.storage.createBucket(name, {
    public: options.public !== undefined ? options.public : true,
    fileSizeLimit: options.fileSizeLimit,
    allowedMimeTypes: options.allowedMimeTypes
  });

  if (error) {
    console.error(`❌ Error creating bucket '${name}':`, error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully created bucket '${name}'`);
  if (options.fileSizeLimit) {
    console.log(`   File Size Limit: ${(options.fileSizeLimit / 1024 / 1024).toFixed(2)} MB`);
  }
  if (options.allowedMimeTypes) {
    console.log(`   Allowed MIME Types: ${options.allowedMimeTypes.join(', ')}`);
  }
}

async function createDefaultBuckets() {
  console.log('🚀 Creating default buckets (images, videos, files)...\n');

  for (const config of DEFAULT_BUCKETS) {
    await createBucket(config.name, {
      public: config.public,
      fileSizeLimit: config.fileSizeLimit,
      allowedMimeTypes: config.allowedMimeTypes
    });
  }

  console.log('\n✅ Default buckets setup complete!');
}

async function deleteBucket(name: string) {
  console.log(`🗑️  Deleting bucket '${name}'...\n`);

  const { error } = await supabase.storage.deleteBucket(name);

  if (error) {
    console.error(`❌ Error deleting bucket '${name}':`, error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully deleted bucket '${name}'`);
}

// Parse command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

function parseArgs(args: string[]) {
  const parsed: Record<string, any> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('--')) {
        // Try to parse as number if it's all digits
        parsed[key] = /^\d+$/.test(nextArg) ? parseInt(nextArg, 10) : nextArg;
        i++;
      } else {
        // Boolean flag
        parsed[key] = true;
      }
    }
  }
  
  return parsed;
}

async function main() {
  const parsedArgs = parseArgs(args);

  switch (command) {
    case 'list':
      await listBuckets();
      break;

    case 'create':
      if (parsedArgs.name) {
        await createBucket(parsedArgs.name, {
          public: parsedArgs.public !== false,
          fileSizeLimit: parsedArgs.sizeLimit || parsedArgs.fileSizeLimit,
          allowedMimeTypes: parsedArgs.mimeTypes ? parsedArgs.mimeTypes.split(',') : undefined
        });
      } else {
        console.error('❌ Error: --name is required for create command');
        console.error('Usage: npx tsx scripts/manage-buckets.ts create --name bucket-name [--public] [--sizeLimit 5242880] [--mimeTypes "image/jpeg,image/png"]');
        process.exit(1);
      }
      break;

    case 'create-default':
    case 'setup':
      await createDefaultBuckets();
      break;

    case 'delete':
      if (parsedArgs.name) {
        await deleteBucket(parsedArgs.name);
      } else {
        console.error('❌ Error: --name is required for delete command');
        console.error('Usage: npx tsx scripts/manage-buckets.ts delete --name bucket-name');
        process.exit(1);
      }
      break;

    default:
      console.log('📦 Supabase Storage Bucket Management');
      console.log('=====================================\n');
      console.log('Usage:');
      console.log('  npx tsx scripts/manage-buckets.ts list                    - List all buckets');
      console.log('  npx tsx scripts/manage-buckets.ts create-default          - Create default buckets (images, videos, files)');
      console.log('  npx tsx scripts/manage-buckets.ts create --name <name>     - Create a custom bucket');
      console.log('  npx tsx scripts/manage-buckets.ts delete --name <name>     - Delete a bucket\n');
      console.log('Examples:');
      console.log('  npx tsx scripts/manage-buckets.ts create --name videos --sizeLimit 52428800');
      console.log('  npx tsx scripts/manage-buckets.ts create --name custom --public --mimeTypes "image/*,video/*"');
      break;
  }
}

main().catch(console.error);

