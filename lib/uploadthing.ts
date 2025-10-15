// utils/uploadthing.ts
import { generateUploadButton, generateUploadDropzone, generateUploader } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const Uploader = generateUploader<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export type AvailableEndpoint = keyof OurFileRouter;

// ✅ include both image and video endpoints
const AVAILABLE_ENDPOINTS: AvailableEndpoint[] = [
  "imageUploader",
  "videoUploader",
];

export function getAvailableEndpoints(): AvailableEndpoint[] {
  return AVAILABLE_ENDPOINTS;
}

export function isAvailableEndpoint(endpoint: string): endpoint is AvailableEndpoint {
  return (AVAILABLE_ENDPOINTS as readonly string[]).includes(endpoint);
}
