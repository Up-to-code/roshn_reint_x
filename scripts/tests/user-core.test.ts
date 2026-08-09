import { describe, expect, test } from "bun:test";
import { assertRoleChange, userNameInputSchema, userRoleInputSchema, UserAdministrationError } from "../../lib/users/user-core";

describe("User administration core", () => {
  test("prevents administrators from demoting themselves", () => {
    expect(() => assertRoleChange({ actorId: "a", targetId: "a", nextRole: "USER", currentRole: "ADMIN", adminCount: 2 })).toThrow(UserAdministrationError);
  });

  test("preserves the final administrator", () => {
    expect(() => assertRoleChange({ actorId: "a", targetId: "b", nextRole: "USER", currentRole: "ADMIN", adminCount: 1 })).toThrow("LAST_ADMIN");
  });

  test("validates names and roles strictly", () => {
    expect(userNameInputSchema.parse({ name: "  Ahmed  " })).toEqual({ name: "Ahmed" });
    expect(userRoleInputSchema.safeParse({ role: "OWNER" }).success).toBe(false);
  });
});
