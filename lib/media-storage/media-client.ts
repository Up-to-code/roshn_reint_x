"use client";

import { bucketForKind, mediaKind, type MediaBucket } from "./media-core";
export { mediaKind, bucketForKind };
export type { MediaBucket };

export function uploadMedia(file: File, bucket: MediaBucket, onProgress?: (progress: number) => void): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.set("file", file);
    body.set("bucket", bucket);
    const request = new XMLHttpRequest();
    request.open("POST", "/api/media/upload");
    request.upload.onprogress = event => event.lengthComputable && onProgress?.(Math.round((event.loaded / event.total) * 90));
    request.onerror = () => reject(new Error("Network error while uploading media"));
    request.onload = () => {
      const result = JSON.parse(request.responseText || "{}");
      if (request.status < 200 || request.status >= 300) return reject(new Error(result.error || "Media upload failed"));
      onProgress?.(100);
      resolve(result);
    };
    request.send(body);
  });
}

export async function getMediaStatus(bucket: MediaBucket) {
  const response = await fetch(`/api/media/status?bucket=${bucket}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Cannot inspect media storage");
  return response.json() as Promise<{ key: MediaBucket; name: string; exists: boolean; isPublic: boolean; fileSizeLimitMB: number; expectedLimitMB: number; isValid: boolean }>;
}
