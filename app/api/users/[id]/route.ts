import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/authorization";
import { authorizationErrorResponse } from "@/lib/http/authorization-response";
import { userModule } from "@/lib/users/user-module";
import { UserAdministrationError } from "@/lib/users/user-core";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const actor = await requireAdmin();
    return NextResponse.json(await userModule.setRole(actor.id, params.id, await request.json()));
  } catch (error) {
    const denied = authorizationErrorResponse(error);
    if (denied) return denied;
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid role", details: error.errors }, { status: 400 });
    if (error instanceof UserAdministrationError) return NextResponse.json({ error: error.code }, { status: error.code === "NOT_FOUND" ? 404 : 409 });
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
