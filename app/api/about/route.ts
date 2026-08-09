import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { aboutModule } from "@/lib/about/about-module";

export async function GET() {
  const response = NextResponse.json({ success: true, data: await aboutModule.get() });
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return response;
}

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: await aboutModule.save(body?.data ?? body) });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ success: false, error: "Invalid about data", details: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: "Failed to save about data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  if (request.nextUrl.searchParams.get("action") !== "reset") return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  return NextResponse.json({ success: true, data: await aboutModule.reset() });
}
