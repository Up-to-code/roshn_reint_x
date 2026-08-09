import { NextRequest, NextResponse } from "next/server";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { MEDIA_BUCKETS, type MediaBucket } from "@/lib/media-storage/media-core";
import { uploadMedia } from "@/lib/media-storage/media-server";

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const form = await request.formData();
    const file = form.get("file");
    const bucket = form.get("bucket");
    if (!(file instanceof File) || typeof bucket !== "string" || !(bucket in MEDIA_BUCKETS)) return NextResponse.json({ error: "A valid file and bucket are required" }, { status: 400 });
    return NextResponse.json(await uploadMedia(file, bucket as MediaBucket), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media upload failed";
    return NextResponse.json({ error: message }, { status: message.includes("limit") || message.includes("Unsupported") ? 400 : 500 });
  }
}
