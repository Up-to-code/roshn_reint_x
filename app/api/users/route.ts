import { NextResponse } from "next/server";

import { adminRouteGuard } from "@/lib/http/authorization-response";
import { userModule } from "@/lib/users/user-module";

export async function GET() {
  try {
    const denied = await adminRouteGuard();
    if (denied) return denied;
    return NextResponse.json(await userModule.list());
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
