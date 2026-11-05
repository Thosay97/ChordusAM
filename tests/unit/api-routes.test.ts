import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import type { Role, SessionUser } from "@/lib/auth/roles";

// The route handlers read the user through getSessionUser; swap it for a test double.
const current: { user: SessionUser | null } = { user: null };
vi.mock("@/lib/auth/session", () => ({
  getSessionUser: async () => current.user,
}));

const routes = {
  admin: () => import("@/app/api/admin/status/route"),
  hr: () => import("@/app/api/hr/status/route"),
  finance: () => import("@/app/api/finance/status/route"),
  "vendor-payments": () => import("@/app/api/vendor-payments/status/route"),
  me: () => import("@/app/api/me/status/route"),
} as const;
type RouteName = keyof typeof routes;

const allowed: Record<RouteName, Role[]> = {
  admin: ["admin"],
  hr: ["hr", "admin"],
  finance: ["finance", "admin"],
  "vendor-payments": ["hr", "admin", "finance"],
  me: ["employee", "hr", "admin", "finance"],
};

const asRole = (role: Role) => DEMO_USERS.find((u) => u.role === role)!;

describe("protected API routes", () => {
  beforeEach(() => {
    current.user = null;
  });

  for (const name of Object.keys(routes) as RouteName[]) {
    it(`/api/${name}/status returns 401 when signed out`, async () => {
      const { GET } = await routes[name]();
      const res = await GET();
      expect(res.status).toBe(401);
    });

    for (const role of ["employee", "hr", "admin", "finance"] as Role[]) {
      const ok = allowed[name].includes(role);
      it(`/api/${name}/status returns ${ok ? 200 : 403} for ${role}`, async () => {
        current.user = asRole(role);
        const { GET } = await routes[name]();
        const res = await GET();
        expect(res.status).toBe(ok ? 200 : 403);
        if (ok) expect(await res.json()).toMatchObject({ ok: true, user: { role } });
      });
    }
  }
});
