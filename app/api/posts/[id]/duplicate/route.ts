import { NextRequest, NextResponse } from "next/server";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { publishingModule } from "@/lib/publishing/publishing-module";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  const post = await publishingModule.duplicate(params.id);
  return post ? NextResponse.json(publishingModule.serialize(post), { status: 201 }) : NextResponse.json({ error: "Post not found" }, { status: 404 });
}
