import { NextResponse } from "next/server";
import { adminRouteGuard } from "@/lib/http/authorization-response";
import { userModule } from "@/lib/users/user-module";

export async function GET() {
  const denied = await adminRouteGuard();
  if (denied) return denied;
  return NextResponse.json(await userModule.list());
}
