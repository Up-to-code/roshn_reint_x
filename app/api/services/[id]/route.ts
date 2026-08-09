import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { serviceModule } from "@/lib/services/service-module";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const service = await serviceModule.update(params.id, await request.json());
    return service ? NextResponse.json(service) : NextResponse.json({ error: "Service not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid service", details: error.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  return (await serviceModule.delete(params.id))
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Service not found" }, { status: 404 });
}
