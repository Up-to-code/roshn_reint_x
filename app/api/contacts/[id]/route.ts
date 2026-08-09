import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { contactDto } from "@/lib/inquiries/inquiry-core";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const body = await request.json();
    return NextResponse.json(contactDto(await inquiryModule.updateContact(params.id, { ...body, phone: body.phoneNumber })));
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    return NextResponse.json({ message: "Contact not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  try {
    const deleted = await inquiryModule.delete(params.id, "CONTACT");
    return deleted ? NextResponse.json({ message: "Contact deleted successfully" }) : NextResponse.json({ message: "Contact not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ message: "Contact not found" }, { status: 404 });
  }
}
