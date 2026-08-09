export const MEDIA_BUCKETS = {
  IMAGES: { name: "images", maxBytes: 10 * 1024 * 1024, mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"] },
  VIDEOS: { name: "videos", maxBytes: 100 * 1024 * 1024, mimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"] },
  FILES: { name: "files", maxBytes: 10 * 1024 * 1024, mimeTypes: null },
} as const;

export type MediaBucket = keyof typeof MEDIA_BUCKETS;
export type MediaKind = "image" | "video" | "file";

export function mediaKind(file: Pick<File, "type">): MediaKind {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

export function bucketForKind(kind: MediaKind): MediaBucket {
  return kind === "image" ? "IMAGES" : kind === "video" ? "VIDEOS" : "FILES";
}

export function validateMedia(file: Pick<File, "name" | "type" | "size">, bucket: MediaBucket) {
  const config = MEDIA_BUCKETS[bucket];
  if (!file.name.trim()) throw new Error("File name is required");
  if (file.size <= 0) throw new Error("File is empty");
  if (file.size > config.maxBytes) throw new Error(`File exceeds the ${config.maxBytes / 1024 / 1024}MB limit`);
  if (config.mimeTypes && !(config.mimeTypes as readonly string[]).includes(file.type)) throw new Error(`Unsupported ${bucket.toLowerCase()} file type`);
  return config;
}

export function safeObjectName(originalName: string, id = crypto.randomUUID()) {
  const extension = originalName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `${new Date().toISOString().slice(0, 10)}/${id}.${extension}`;
}
