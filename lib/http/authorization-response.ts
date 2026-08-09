import { NextResponse } from "next/server";

import { AuthorizationError } from "@/lib/authorization-core";
import { requireAdmin } from "@/lib/authorization";

export function authorizationErrorResponse(error: unknown): NextResponse | null {
  return error instanceof AuthorizationError
    ? NextResponse.json({ error: error.message }, { status: error.status })
    : null;
}

async function guard(check: () => Promise<unknown>): Promise<NextResponse | null> {
  try {
    await check();
    return null;
  } catch (error) {
    const response = authorizationErrorResponse(error);
    if (response) return response;
    throw error;
  }
}

export function adminRouteGuard(): Promise<NextResponse | null> {
  return guard(requireAdmin);
}
