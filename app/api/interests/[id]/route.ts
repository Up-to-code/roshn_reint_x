import { NextRequest, NextResponse } from "next/server";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const { read } = await request.json();
    if (typeof read !== "boolean") return NextResponse.json({ error: "read must be a boolean" }, { status: 400 });
    const interest = await inquiryModule.markRead(params.id, read);
    return interest ? NextResponse.json(interest) : NextResponse.json({ error: "Interest not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Interest not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const deleted = await inquiryModule.delete(params.id, "PROPERTY_INTEREST");
    return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Interest not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Interest not found" }, { status: 404 });
  }
}
