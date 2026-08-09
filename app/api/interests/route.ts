import { NextRequest, NextResponse, userAgent } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  const { items } = await inquiryModule.list({ kind: "PROPERTY_INTEREST", pageSize: 100 });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { os } = userAgent(request);
    const inquiry = await inquiryModule.createPropertyInterest(body, os?.name);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    console.error("Failed to create interest:", error);
    return NextResponse.json({ error: "Failed to create interest" }, { status: 500 });
  }
}
