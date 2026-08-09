import "server-only";

import {
  assertAdmin,
  assertAuthenticated,
  assertSelfOrAdmin,
  AuthorizationError,
} from "@/lib/authorization-core";
import { getCurrentUser } from "@/lib/session";

export { AuthorizationError } from "@/lib/authorization-core";

export async function requireAuthenticated() {
  const user = await getCurrentUser();
  assertAuthenticated(user);
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  assertAdmin(user);
  return user;
}

export async function requireSelfOrAdmin(subjectId: string) {
  const user = await getCurrentUser();
  assertSelfOrAdmin(user, subjectId);
  return user;
}
