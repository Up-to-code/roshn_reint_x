import { z } from "zod";

const userRoles = ["ADMIN", "USER"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleInputSchema = z.object({ role: z.enum(userRoles) }).strict();
export const userNameInputSchema = z.object({ name: z.string().trim().min(3).max(80) }).strict();

export class UserAdministrationError extends Error {
  constructor(public readonly code: "NOT_FOUND" | "SELF_DEMOTION" | "LAST_ADMIN") { super(code); }
}

export function assertRoleChange(input: { actorId: string; targetId: string; nextRole: UserRole; currentRole: string | null; adminCount: number }) {
  if (input.currentRole === input.nextRole) return;
  if (input.actorId === input.targetId && input.nextRole !== "ADMIN") throw new UserAdministrationError("SELF_DEMOTION");
  if (input.currentRole === "ADMIN" && input.nextRole !== "ADMIN" && input.adminCount <= 1) throw new UserAdministrationError("LAST_ADMIN");
}
