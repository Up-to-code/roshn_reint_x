import { NextRequest, NextResponse, userAgent } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { contactDto } from "@/lib/inquiries/inquiry-core";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

export async function GET() {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  const { items } = await inquiryModule.list({ kind: "CONTACT", pageSize: 100 });
  return NextResponse.json(items.map(contactDto));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { os } = userAgent(request);
    const inquiry = await inquiryModule.createContact({ ...body, phone: body.phoneNumber }, os?.name);
    return NextResponse.json({ success: true, contact: contactDto(inquiry) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    console.error("Failed to create contact:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
