import { NextRequest, NextResponse } from "next/server";

import { propertyModule } from "@/lib/properties/property-module";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json([]);

  try {
    return NextResponse.json(await propertyModule.list({ query, limit: 10 }));
  } catch (error) {
    console.error("Property search failed:", error);
    return NextResponse.json({ error: "Failed to search properties" }, { status: 500 });
  }
}
