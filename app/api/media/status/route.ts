import { NextRequest, NextResponse } from "next/server";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { MEDIA_BUCKETS, type MediaBucket } from "@/lib/media-storage/media-core";
import { mediaStorageStatus } from "@/lib/media-storage/media-server";

export async function GET(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  const bucket = request.nextUrl.searchParams.get("bucket");
  if (!bucket || !(bucket in MEDIA_BUCKETS)) return NextResponse.json({ error: "Valid bucket is required" }, { status: 400 });
  try {
    const [status] = await mediaStorageStatus(bucket as MediaBucket);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cannot inspect media storage" }, { status: 500 });
  }
}
