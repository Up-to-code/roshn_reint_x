import { describe, expect, test } from "bun:test";

import {
  assertAdmin,
  assertAuthenticated,
  assertSelfOrAdmin,
} from "../../lib/authorization-core";

describe("Authorization policy", () => {
  test("distinguishes unauthenticated and unauthorized actors", () => {
    expect(() => assertAuthenticated(null)).toThrow("Authentication required");
    expect(() => assertAdmin({ id: "user", role: "USER" })).toThrow(
      "Administrator access required",
    );
  });

  test("allows administrators through the admin capability", () => {
    expect(() => assertAdmin({ id: "admin", role: "ADMIN" })).not.toThrow();
  });

  test("allows self access without granting cross-user access", () => {
    expect(() => assertSelfOrAdmin({ id: "user-a", role: "USER" }, "user-a")).not.toThrow();
    expect(() => assertSelfOrAdmin({ id: "user-a", role: "USER" }, "user-b")).toThrow(
      "Access denied",
    );
    expect(() => assertSelfOrAdmin({ id: "admin", role: "ADMIN" }, "user-b")).not.toThrow();
  });
});
