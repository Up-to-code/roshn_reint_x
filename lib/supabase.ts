import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both old and new key names
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? '✓' : '✗');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY (fallback):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗');
  throw new Error('Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to your .env.local file.');
}

// Create Supabase client without auth (for public uploads)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // No auth needed for public uploads
    autoRefreshToken: false,
  },
  // Disable auth for storage operations
  global: {
    headers: {},
  },
});

// Storage bucket names (must already exist in Supabase dashboard)
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  FILES: 'files',
} as const;

export type StorageBucket = keyof typeof STORAGE_BUCKETS;

// Helper: get actual bucket name
export function getBucketName(bucket: StorageBucket): string {
  return STORAGE_BUCKETS[bucket];
}

// Determine file type
export function getFileType(file: File | Blob): 'image' | 'video' | 'file' {
  if ('type' in file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
  }
  return 'file';
}

export function getBucketForFileType(fileType: 'image' | 'video' | 'file'): string {
  switch (fileType) {
    case 'image':
      return STORAGE_BUCKETS.IMAGES;
    case 'video':
      return STORAGE_BUCKETS.VIDEOS;
    default:
      return STORAGE_BUCKETS.FILES;
  }
}

// Generate unique filename
export function generateFileName(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// Upload file to Supabase storage (public upload, no auth required)
// Note: Make sure your bucket is public and RLS policies allow anonymous uploads
export async function uploadToSupabase(
  file: File,
  bucket: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  const fileName = generateFileName(file);

  // Validate Supabase client is initialized
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please check your environment variables.');
  }

  try {
    // Report initial progress
    if (onProgress) {
      onProgress(5);
    }

    // Try to validate bucket exists (optional - might fail due to RLS)
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (!listError && buckets) {
        const bucketExists = buckets.some(b => b.name === bucket);
        if (!bucketExists) {
          console.warn(`Bucket '${bucket}' might not exist. Attempting upload anyway...`);
        }
      }
    } catch (listErr) {
      // Ignore bucket listing errors - RLS might prevent it
      console.warn('Could not verify bucket existence (this is OK if RLS is enabled):', listErr);
    }

    // Report progress
    if (onProgress) {
      onProgress(10);
    }

    // Upload file with retry logic for network errors
    let uploadData;
    let error;
    let retries = 2;
    
    while (retries >= 0) {
      try {
        const result = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        uploadData = result.data;
        error = result.error;
        
        if (!error) {
          break; // Success, exit retry loop
        }
        
        // If it's a duplicate error, generate new filename
        if (error.message.includes('duplicate') || error.message.includes('already exists')) {
          const newFileName = generateFileName(file);
          const retryResult = await supabase.storage
            .from(bucket)
            .upload(newFileName, file, {
              cacheControl: '3600',
              upsert: false,
            });
          
          if (!retryResult.error) {
            uploadData = retryResult.data;
            error = null;
            // Update fileName for URL generation
            const { data } = supabase.storage.from(bucket).getPublicUrl(newFileName);
            if (data?.publicUrl) {
              if (onProgress) {
                onProgress(100);
              }
              return {
                url: data.publicUrl,
                path: newFileName,
              };
            }
          }
        }
        
        // If it's a network error and we have retries left, wait and retry
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          if (retries > 0) {
            console.warn(`Upload failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            retries--;
            continue;
          }
        }
        
        // For other errors or out of retries, throw
        break;
      } catch (networkErr) {
        if (retries > 0 && (networkErr instanceof TypeError || networkErr instanceof Error)) {
          const isNetworkError = networkErr instanceof TypeError || 
                                networkErr.message.includes('fetch') || 
                                networkErr.message.includes('network') ||
                                networkErr.message.includes('Failed to fetch');
          
          if (isNetworkError) {
            console.warn(`Network error, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
            continue;
          }
        }
        throw networkErr;
      }
    }

    if (error) {
      // More detailed error messages
      if (error.message.includes('Bucket not found') || error.message.includes('not found')) {
        throw new Error(`Bucket '${bucket}' not found. Please create it in Supabase Dashboard: Storage → New bucket → Name: "${bucket}" → Make it Public → Create. Or visit /api/setup-buckets for automated setup.`);
      }
      if (error.message.includes('new row violates row-level security') || error.message.includes('RLS') || error.message.includes('row-level security')) {
        throw new Error(`Upload blocked by Row Level Security (RLS). For public uploads, you need to either:
1. Disable RLS on the '${bucket}' bucket in Supabase Dashboard → Storage → Policies
2. Or create a policy that allows INSERT for anonymous users (authenticated = false)`);
      }
      if (error.message.includes('JWT') || error.message.includes('token') || error.message.includes('Unauthorized')) {
        throw new Error(`Authentication failed. Please check your Supabase API keys.`);
      }
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!uploadData) {
      throw new Error('Upload completed but no data returned');
    }

    // Report upload progress
    if (onProgress) {
      onProgress(90);
    }

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(uploadData.path || fileName);

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL. The file may have been uploaded but the bucket might not be public.');
    }

    // Report completion
    if (onProgress) {
      onProgress(100);
    }

    return {
      url: data.publicUrl,
      path: uploadData.path || fileName,
    };
  } catch (err) {
    let errorMessage = 'Unknown error';
    
    if (err instanceof TypeError && err.message.includes('fetch')) {
      errorMessage = 'Network error: Failed to connect to Supabase. Please check your internet connection and Supabase URL.';
    } else if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    console.error('Supabase upload error:', {
      error: err,
      message: errorMessage,
      bucket,
      fileName,
      supabaseConfigured: !!supabase
    });
    
    throw new Error(errorMessage);
  }
}

// Delete file from Supabase storage
export async function deleteFromSupabase(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
