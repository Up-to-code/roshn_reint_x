import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/session";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { publishingModule } from "@/lib/publishing/publishing-module";

type Context = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Context) {
  const user = await getCurrentUser();
  const post = user?.role === "ADMIN" ? await publishingModule.getEditor(params.id) : await publishingModule.getPublic(params.id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() });
}

export async function PUT(request: NextRequest, { params }: Context) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const post = await publishingModule.update(params.id, await request.json());
    return post ? NextResponse.json(publishingModule.serialize(post)) : NextResponse.json({ error: "Post not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid post", details: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  return (await publishingModule.delete(params.id))
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Post not found" }, { status: 404 });
}
