import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { serviceModule } from "@/lib/services/service-module";

export async function GET() {
  const response = NextResponse.json(await serviceModule.getPage());
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return response;
}

export async function PUT(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = await request.json();
    return NextResponse.json(await serviceModule.savePage(input));
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid services page", details: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update services page" }, { status: 500 });
  }
}
