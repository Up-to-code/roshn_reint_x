import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { resend } from "@/lib/email";

const prisma = new PrismaClient();
 
// 📍 GET all interests
export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(interests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}

// 📨 POST - Create new interest and send email
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, propertyTitle } = data;

    if (!name || !phone || !propertyTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const interest = await prisma.interest.create({
      data: { name, email, phone, message, propertyTitle },
    });

    await resend.emails.send({
      from: "Real Estate <no-reply@yourdomain.com>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New interest in ${propertyTitle}`,
      html: `
        <h2>📍 Property: ${propertyTitle}</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        ${email ? `<p><b>Email:</b> ${email}</p>` : ""}
        ${message ? `<p><b>Message:</b> ${message}</p>` : ""}
        <hr />
        <small>Sent automatically from your real estate platform</small>
      `,
    });

    return NextResponse.json({ success: true, interest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit interest" }, { status: 500 });
  }
}

// ✏️ PUT - Update existing interest
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, name, email, phone, message, propertyTitle } = data;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.interest.update({
      where: { id },
      data: { name, email, phone, message, propertyTitle },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 });
  }
}

// ❌ DELETE - Remove an interest
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.interest.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete interest" }, { status: 500 });
  }
}
