import { NextRequest, NextResponse } from "next/server";

import { adminRouteGuard } from "@/lib/http/authorization-response";
import { SiteContentError } from "@/lib/site-content/site-content-core";
import { siteContentModule } from "@/lib/site-content/site-content-module";

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await siteContentModule.getGlobalSettings() });
  } catch (error) {
    console.error("Failed to read global settings:", error);
    return NextResponse.json({ success: false, error: "Failed to read global settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;

  try {
    const data = await siteContentModule.saveGlobalSettings(await request.json());
    return NextResponse.json({ success: true, message: "Settings saved", data });
  } catch (error) {
    if (error instanceof SiteContentError) {
      return NextResponse.json({ success: false, error: error.message, details: error.details }, { status: 400 });
    }
    console.error("Failed to save global settings:", error);
    return NextResponse.json({ success: false, error: "Failed to save global settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  if (request.nextUrl.searchParams.get("action") !== "reset") {
    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  }

  try {
    const data = await siteContentModule.resetGlobalSettings();
    return NextResponse.json({ success: true, message: "Settings reset", data });
  } catch (error) {
    console.error("Failed to reset global settings:", error);
    return NextResponse.json({ success: false, error: "Failed to reset global settings" }, { status: 500 });
  }
}
