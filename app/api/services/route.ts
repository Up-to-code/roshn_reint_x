import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/session";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { serviceModule } from "@/lib/services/service-module";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";
    const response = NextResponse.json(isAdmin ? await serviceModule.listEditor() : await serviceModule.listPublic());
    response.headers.set("Cache-Control", isAdmin ? "private, no-store" : "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    return NextResponse.json(await serviceModule.create(await request.json()), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid service", details: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
