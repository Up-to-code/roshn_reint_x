import { NextRequest, NextResponse } from "next/server";

import { adminRouteGuard } from "@/lib/http/authorization-response";
import { SiteContentError } from "@/lib/site-content/site-content-core";
import { siteContentModule } from "@/lib/site-content/site-content-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const requestedLocale = request.nextUrl.searchParams.get("locale");
    const locale = requestedLocale === "en" || requestedLocale === "ar" ? requestedLocale : undefined;
    return NextResponse.json({ success: true, data: locale ? await siteContentModule.getLocalizedHomePage(locale) : await siteContentModule.getHomePage() });
  } catch (error) {
    console.error("Failed to read homepage content:", error);
    return NextResponse.json({ success: false, error: "Failed to read homepage content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await adminRouteGuard();
  if (denied) return denied;

  try {
    const data = await siteContentModule.saveHomePage(await request.json());
    return NextResponse.json({ success: true, message: "Homepage content saved", data });
  } catch (error) {
    if (error instanceof SiteContentError) {
      return NextResponse.json({ success: false, error: error.message, details: error.details }, { status: 400 });
    }
    console.error("Failed to save homepage content:", error);
    return NextResponse.json({ success: false, error: "Failed to save homepage content" }, { status: 500 });
  }
}
