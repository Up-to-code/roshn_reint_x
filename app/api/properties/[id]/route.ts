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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await propertyModule.getById(params.id);
    if (!property) throw new PropertyModuleError("Property not found", "NOT_FOUND");
    const response = NextResponse.json(property);
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    return NextResponse.json(await propertyModule.update(params.id, await request.json()));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await propertyModule.delete(params.id);
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
