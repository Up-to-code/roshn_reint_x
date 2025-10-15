import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Upload file to Supabase storage
export async function uploadToSupabase(
  file: File,
  bucket: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
  const fileName = generateFileName(file);

  try {
    // Upload file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    // Simulate progress for UX
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);
    }

    return {
      url: data.publicUrl,
      path: fileName,
    };
  } catch (err) {
    throw new Error(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// Delete file from Supabase storage
export async function deleteFromSupabase(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
