import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");
const apiRoot = resolve(root, "app/api");
const securityMarkers = ["adminRouteGuard", "requireAdmin", "requireAuthenticated", "requireSelfOrAdmin"];

function routeFiles() {
  return [...new Bun.Glob("**/route.ts").scanSync({ cwd: apiRoot, absolute: true })];
}

function handler(source: string, method: string) {
  const start = source.indexOf(`export async function ${method}`);
  if (start < 0) return null;
  const next = source.indexOf("\nexport async function ", start + 1);
  return source.slice(start, next < 0 ? undefined : next);
}

describe("HTTP architecture", () => {
  test("does not publicly cache every API response", () => {
    const config = readFileSync(resolve(root, "next.config.js"), "utf8");
    expect(config).not.toMatch(/source:\s*["']\/api\/?:path\*/);
  });

  test("every non-intake mutation has an explicit capability check", () => {
    const intentionalPublicIntake = new Set(["contacts/route.ts:POST", "interests/route.ts:POST"]);
    const missing: string[] = [];
    for (const file of routeFiles()) {
      const source = readFileSync(file, "utf8");
      const route = relative(apiRoot, file);
      for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
        const body = handler(source, method);
        if (!body || intentionalPublicIntake.has(`${route}:${method}`)) continue;
        if (!securityMarkers.some(marker => body.includes(marker))) missing.push(`${route}:${method}`);
      }
    }
    expect(missing).toEqual([]);
  });

  test("private collection reads retain an administrator guard", () => {
    const privateReads = ["contacts/route.ts", "interests/route.ts", "events/route.ts", "users/route.ts", "media/status/route.ts"];
    for (const route of privateReads) {
      const body = handler(readFileSync(resolve(apiRoot, route), "utf8"), "GET");
      expect(body, route).not.toBeNull();
      expect(securityMarkers.some(marker => body!.includes(marker)), route).toBe(true);
    }
  });

  test("deep domain route adapters do not bypass their modules", () => {
    const domainRoutes = ["about", "services", "posts", "properties", "contacts", "interests", "events", "users"];
    const bypasses = routeFiles()
      .filter(file => domainRoutes.includes(relative(apiRoot, file).split("/")[0]))
      .filter(file => /\bprisma\./.test(readFileSync(file, "utf8")))
      .map(file => relative(apiRoot, file));
    expect(bypasses).toEqual([]);
  });
});
