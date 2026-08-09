import { createClient } from "@supabase/supabase-js";
import { MEDIA_BUCKETS, safeObjectName, validateMedia, type MediaBucket } from "./media-core";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Media storage is not configured");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function uploadMedia(file: File, bucket: MediaBucket) {
  const config = validateMedia(file, bucket);
  const path = safeObjectName(file.name);
  const client = adminClient();
  const { error } = await client.storage.from(config.name).upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (error) throw new Error(`Media upload failed: ${error.message}`);
  const { data } = client.storage.from(config.name).getPublicUrl(path);
  return { url: data.publicUrl, path, bucket: config.name };
}

export async function mediaStorageStatus(bucket?: MediaBucket) {
  const { data, error } = await adminClient().storage.listBuckets();
  if (error) throw new Error(`Cannot inspect media storage: ${error.message}`);
  const required = bucket ? [[bucket, MEDIA_BUCKETS[bucket]] as const] : Object.entries(MEDIA_BUCKETS) as Array<[MediaBucket, typeof MEDIA_BUCKETS[MediaBucket]]>;
  return required.map(([key, config]) => {
    const actual = data.find(item => item.name === config.name);
    return { key, name: config.name, exists: Boolean(actual), isPublic: actual?.public ?? false, fileSizeLimitMB: (actual?.file_size_limit || 0) / 1024 / 1024, expectedLimitMB: config.maxBytes / 1024 / 1024, isValid: Boolean(actual?.public && (actual.file_size_limit || 0) >= config.maxBytes) };
  });
}

export async function provisionMediaStorage() {
  const client = adminClient();
  const { data: existing, error } = await client.storage.listBuckets();
  if (error) throw new Error(`Cannot list media buckets: ${error.message}`);
  return Promise.all(Object.values(MEDIA_BUCKETS).map(async config => {
    const current = existing.find(bucket => bucket.name === config.name);
    if (current) {
      const { error: updateError } = await client.storage.updateBucket(config.name, { public: true, fileSizeLimit: config.maxBytes, allowedMimeTypes: config.mimeTypes ? [...config.mimeTypes] : undefined });
      if (updateError) throw new Error(`Cannot update ${config.name}: ${updateError.message}`);
      return { name: config.name, status: "updated" as const };
    }
    const { error: createError } = await client.storage.createBucket(config.name, { public: true, fileSizeLimit: config.maxBytes, allowedMimeTypes: config.mimeTypes ? [...config.mimeTypes] : undefined });
    if (createError) throw new Error(`Cannot create ${config.name}: ${createError.message}`);
    return { name: config.name, status: "created" as const };
  }));
}
