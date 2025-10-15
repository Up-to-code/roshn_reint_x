import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS } from './supabase';

// Use service role key for administrative operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.');
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Bucket configuration
const BUCKET_CONFIGS = [
  {
    name: 'images', // Use lowercase directly
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  },
  {
    name: 'videos', // Use lowercase directly
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
  },
  {
    name: 'files', // Use lowercase directly
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['*/*'] // Allow all file types
  }
];

// Create all required storage buckets
export async function createStorageBuckets() {
  const results = [];
  
  for (const config of BUCKET_CONFIGS) {
    try {
      // Check if bucket already exists
      const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        continue;
      }
      
      const bucketExists = existingBuckets?.some(bucket => bucket.name === config.name);
      
      if (bucketExists) {
        console.log(`Bucket '${config.name}' already exists`);
        results.push({ name: config.name, status: 'exists' });
        continue;
      }
      
      // Create the bucket
      const { data, error } = await supabaseAdmin.storage.createBucket(config.name, {
        public: config.public,
        fileSizeLimit: config.fileSizeLimit,
        allowedMimeTypes: config.allowedMimeTypes
      });
      
      if (error) {
        console.error(`Error creating bucket '${config.name}':`, error);
        results.push({ name: config.name, status: 'error', error: error.message });
      } else {
        console.log(`Successfully created bucket '${config.name}'`);
        results.push({ name: config.name, status: 'created' });
      }
    } catch (err) {
      console.error(`Unexpected error creating bucket '${config.name}':`, err);
      results.push({ name: config.name, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }
  
  return results;
}

// Check if all required buckets exist
export async function checkStorageBuckets() {
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    
    if (error) {
      throw new Error(`Failed to list buckets: ${error.message}`);
    }
    
    const bucketNames = buckets?.map(bucket => bucket.name) || [];
    const requiredBuckets = ['images', 'videos', 'files']; // Use lowercase directly
    
    const missingBuckets = requiredBuckets.filter(bucket => !bucketNames.includes(bucket));
    const existingBuckets = requiredBuckets.filter(bucket => bucketNames.includes(bucket));
    
    return {
      allExist: missingBuckets.length === 0,
      existing: existingBuckets,
      missing: missingBuckets,
      allBuckets: bucketNames
    };
  } catch (err) {
    throw new Error(`Failed to check buckets: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// Setup script that can be run manually
export async function setupSupabaseStorage() {
  console.log('🚀 Setting up Supabase Storage...');
  
  try {
    // First check what buckets exist
    const bucketStatus = await checkStorageBuckets();
    console.log('📊 Current bucket status:', bucketStatus);
    
    if (bucketStatus.allExist) {
      console.log('✅ All required buckets already exist!');
      return { success: true, message: 'All buckets already exist' };
    }
    
    // Create missing buckets
    console.log('🔨 Creating missing buckets...');
    const results = await createStorageBuckets();
    
    const successCount = results.filter(r => r.status === 'created' || r.status === 'exists').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    console.log(`✅ Setup complete! ${successCount} buckets ready, ${errorCount} errors`);
    
    return {
      success: errorCount === 0,
      results,
      message: errorCount === 0 ? 'All buckets created successfully' : 'Some buckets failed to create'
    };
  } catch (err) {
    console.error('❌ Setup failed:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      message: 'Setup failed'
    };
  }
}
