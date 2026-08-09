import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/session";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { publishingModule } from "@/lib/publishing/publishing-module";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";
    const posts = isAdmin ? await publishingModule.listEditor() : await publishingModule.listPublic();
    const response = NextResponse.json(posts.map(post => ({ ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() })));
    response.headers.set("Cache-Control", isAdmin ? "private, no-store" : "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    return NextResponse.json(publishingModule.serialize(await publishingModule.create(await request.json())), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid post", details: error.errors }, { status: 400 });
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
