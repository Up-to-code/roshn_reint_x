import { NextResponse } from "next/server";
  import { prisma } from "@/lib/db"; // Your prisma client instance
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    // 1. Check if user is authenticated and is an ADMIN
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const { role } = body;

    // 2. Validate the role
    if (role !== "ADMIN" && role !== "USER") {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // 3. Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        role: role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}