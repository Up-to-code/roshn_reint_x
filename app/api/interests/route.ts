import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/email"; // ✅ تأكد أن هذا الملف فيه المفتاح الصحيح

// 📍 GET all interests
export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ GET: Found", interests.length, "interests");
    return NextResponse.json(interests);
  } catch (error) {
    console.error("❌ GET /api/interests error:", error);
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}

// 📨 POST - Create new interest and send email
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, propertyTitle } = data;

    console.log("📩 POST Data Received:", data);

    if (!name || !phone || !propertyTitle) {
      console.warn("⚠️ Missing fields:", { name, phone, propertyTitle });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🗄️ Save to DB
    const interest = await prisma.interest.create({
      data: { name, email, phone, message, propertyTitle },
    });

    console.log("✅ Interest saved to DB:", interest);

    // 📧 Prepare and send email
    const adminEmail = process.env.ADMIN_EMAIL || "roshnreit6@gmail.com";

    console.log("🚀 Sending email via Resend...");
    console.log("🔧 Using admin email:", adminEmail);

    const result = await resend.emails.send({
      from: adminEmail,
      to: adminEmail,
      subject: `🏡 New interest in "${propertyTitle}"`,
      html: `
        <h2>📍 Property: ${propertyTitle}</h2>
        <p><b>👤 Name:</b> ${name}</p>
        <p><b>📞 Phone:</b> ${phone}</p>
        ${email ? `<p><b>✉️ Email:</b> ${email}</p>` : ""}
        ${message ? `<p><b>📝 Message:</b> ${message}</p>` : ""}
        <hr />
        <small>Sent automatically from your real estate platform.</small>
      `,
    });

    console.log("📬 Resend response:", result);

    if (result.error) {
      console.error("❌ Resend failed:", result.error);
    } else {
      console.log("✅ Email sent successfully to:", adminEmail);
    }

    return NextResponse.json({ success: true, interest, emailResult: result });
  } catch (error) {
    console.error("❌ POST /api/interests error:", error);
    return NextResponse.json({ error: "Failed to submit interest" }, { status: 500 });
  }
}

// ✏️ PUT - Update existing interest
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, name, email, phone, message, propertyTitle } = data;
    console.log("✏️ PUT data:", data);

    if (!id) {
      console.warn("⚠️ Missing ID for update");
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.interest.update({
      where: { id },
      data: { name, email, phone, message, propertyTitle },
    });

    console.log("✅ Updated record:", updated);

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("❌ PUT /api/interests error:", error);
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 });
  }
}

// ❌ DELETE - Remove one or all interests
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      console.log("🗑️ Deleting interest with id:", id);
      await prisma.interest.delete({ where: { id } });
    } else {
      console.log("🗑️ Clearing all interests");
      await prisma.interest.deleteMany();
    }

    console.log("✅ Deletion successful");

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE /api/interests error:", error);
    return NextResponse.json({ error: "Failed to delete interest(s)" }, { status: 500 });
  }
}
