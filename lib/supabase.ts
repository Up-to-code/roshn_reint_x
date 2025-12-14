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
    let bucketConfig: { name: string; public: boolean; file_size_limit: number } | null = null;
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (!listError && buckets) {
        const bucketInfo = buckets.find(b => b.name === bucket);
        if (bucketInfo) {
          bucketConfig = {
            name: bucketInfo.name,
            public: bucketInfo.public,
            file_size_limit: bucketInfo.file_size_limit || 0,
          };
          console.log('Bucket configuration:', {
            bucket: bucketInfo.name,
            public: bucketInfo.public,
            fileSizeLimitMB: (bucketInfo.file_size_limit / (1024 * 1024)).toFixed(2),
            fileSizeLimitBytes: bucketInfo.file_size_limit,
          });
        } else {
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
    const fileSizeMB = file.size / (1024 * 1024);
    let uploadData;
    let error;
    let retries = 2;
    let attemptNumber = 0;
    
    console.log('Starting upload:', {
      fileName,
      fileSizeMB: fileSizeMB.toFixed(2),
      fileSizeBytes: file.size,
      bucket,
      bucketConfig,
      maxRetries: retries + 1,
    });
    
    while (retries >= 0) {
      attemptNumber++;
      try {
        console.log(`Upload attempt ${attemptNumber}/${retries + 2}:`, {
          fileName,
          bucket,
          fileSizeMB: fileSizeMB.toFixed(2),
        });

        const result = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        uploadData = result.data;
        error = result.error;
        
        if (!error) {
          console.log('Upload successful:', {
            fileName,
            path: uploadData?.path,
            bucket,
            attemptNumber,
          });
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
            console.warn(`Upload failed (network error), retrying... (${retries} attempts left):`, {
              fileName,
              bucket,
              error: error.message,
              attemptNumber,
            });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            retries--;
            continue;
          }
        }
        
        // Log error before breaking
        console.error('Upload error (non-network):', {
          fileName,
          bucket,
          error: error.message,
          attemptNumber,
          fileSizeMB: fileSizeMB.toFixed(2),
          bucketConfig,
        });
        
        // For other errors or out of retries, throw
        break;
      } catch (networkErr) {
        if (retries > 0 && (networkErr instanceof TypeError || networkErr instanceof Error)) {
          const isNetworkError = networkErr instanceof TypeError || 
                                networkErr.message.includes('fetch') || 
                                networkErr.message.includes('network') ||
                                networkErr.message.includes('Failed to fetch');
          
          if (isNetworkError) {
            console.warn(`Network error, retrying... (${retries} attempts left):`, {
              fileName,
              bucket,
              error: networkErr instanceof Error ? networkErr.message : String(networkErr),
              attemptNumber,
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
            continue;
          }
        }
        console.error('Upload exception:', {
          fileName,
          bucket,
          error: networkErr,
          attemptNumber,
          fileSizeMB: fileSizeMB.toFixed(2),
        });
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
    
    const fileSizeMB = file.size / (1024 * 1024);
    
    console.error('Supabase upload error:', {
      error: err,
      message: errorMessage,
      bucket,
      fileName,
      fileSizeMB: fileSizeMB.toFixed(2),
      fileSizeBytes: file.size,
      fileType: file.type,
      supabaseConfigured: !!supabase,
      supabaseUrl: supabaseUrl ? 'configured' : 'missing',
      errorStack: err instanceof Error ? err.stack : undefined,
    });
    
    throw new Error(errorMessage);
  }
}

// Validate video bucket configuration
export interface VideoBucketValidation {
  exists: boolean;
  isPublic: boolean;
  fileSizeLimitMB: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateVideoBucket(): Promise<VideoBucketValidation> {
  const result: VideoBucketValidation = {
    exists: false,
    isPublic: false,
    fileSizeLimitMB: 0,
    isValid: false,
    errors: [],
    warnings: [],
  };

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      result.errors.push(`Failed to list buckets: ${listError.message}`);
      console.error('Bucket validation error:', listError);
      return result;
    }

    if (!buckets) {
      result.errors.push('No buckets found');
      return result;
    }

    const videoBucket = buckets.find(b => b.name === STORAGE_BUCKETS.VIDEOS);
    
    if (!videoBucket) {
      result.errors.push(`Video bucket '${STORAGE_BUCKETS.VIDEOS}' does not exist`);
      console.warn('Video bucket validation:', result);
      return result;
    }

    result.exists = true;
    result.isPublic = videoBucket.public || false;
    result.fileSizeLimitMB = (videoBucket.file_size_limit || 0) / (1024 * 1024);

    // Validation checks
    if (!result.isPublic) {
      result.warnings.push('Video bucket is not public. Uploads may fail.');
    }

    if (result.fileSizeLimitMB < 100) {
      result.warnings.push(`Video bucket file size limit is ${result.fileSizeLimitMB.toFixed(2)}MB. Recommended: 100MB+ for video uploads.`);
    }

    if (result.fileSizeLimitMB === 0) {
      result.errors.push('Video bucket has no file size limit configured');
    }

    result.isValid = result.errors.length === 0;

    console.log('Video bucket validation:', {
      exists: result.exists,
      isPublic: result.isPublic,
      fileSizeLimitMB: result.fileSizeLimitMB.toFixed(2),
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings,
    });

    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    result.errors.push(`Validation failed: ${errorMessage}`);
    console.error('Video bucket validation exception:', err);
    return result;
  }
}

// Delete file from Supabase storage
export async function deleteFromSupabase(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
