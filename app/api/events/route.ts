import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { eventModule } from "@/lib/events/event-module";

export async function GET(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const events = await eventModule.list(Object.fromEntries(request.nextUrl.searchParams));
    return NextResponse.json({ success: true, events, count: events.length });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ success: false, error: "Invalid event query", details: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}
