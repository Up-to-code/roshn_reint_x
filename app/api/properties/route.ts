import { NextRequest, NextResponse } from "next/server";

import { AuthorizationError, requireAdmin } from "@/lib/authorization";
import { PropertyModuleError } from "@/lib/properties/property-core";
import { propertyModule } from "@/lib/properties/property-module";

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof PropertyModuleError) {
    const status = error.code === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json({ error: error.message, details: error.details }, { status });
  }
  console.error("Property request failed:", error);
  return NextResponse.json({ error: "Property request failed" }, { status: 500 });
}

export async function GET() {
  try {
    const response = NextResponse.json(await propertyModule.list());
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    return NextResponse.json(await propertyModule.create(await request.json()), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
