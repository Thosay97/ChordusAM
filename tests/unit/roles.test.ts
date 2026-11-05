import { describe, expect, it } from "vitest";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import {
  MODULE_KEYS,
  canAccessModule,
  homePathFor,
  modulesFor,
  type ModuleKey,
  type Role,
  type SessionUser,
} from "@/lib/auth/roles";

function user(role: Role, extra: Partial<SessionUser> = {}): SessionUser {
  return {
    id: "u",
    email: "u@x.test",
    fullName: "U",
    role,
    canRequestPayments: false,
    active: true,
    ...extra,
  };
}

const expected: Record<Role, ModuleKey[]> = {
  employee: ["self_service"],
  hr: ["self_service", "hr", "vendor_payments"],
  finance: ["self_service", "vendor_payments", "finance"],
  admin: ["self_service", "hr", "vendor_payments", "finance", "admin"],
};

describe("module access matrix", () => {
  for (const role of Object.keys(expected) as Role[]) {
    it(`${role} sees exactly its modules`, () => {
      expect(modulesFor(user(role)).map((m) => m.key)).toEqual(expected[role]);
    });

    it(`${role} is denied every other module`, () => {
      for (const key of MODULE_KEYS) {
        expect(canAccessModule(user(role), key)).toBe(expected[role].includes(key));
      }
    });
  }

  it("employees with the payments permission also get Vendor Payments, nothing more", () => {
    const producer = user("employee", { canRequestPayments: true });
    expect(modulesFor(producer).map((m) => m.key)).toEqual(["self_service", "vendor_payments"]);
  });

  it("Finance never gets HR (no attendance or leave detail)", () => {
    expect(canAccessModule(user("finance", { canRequestPayments: true }), "hr")).toBe(false);
  });

  it("inactive users can open nothing", () => {
    for (const role of Object.keys(expected) as Role[]) {
      expect(modulesFor(user(role, { active: false }))).toEqual([]);
    }
  });
});

describe("home paths", () => {
  it("sends each role to a module it can open", () => {
    for (const role of Object.keys(expected) as Role[]) {
      const u = user(role);
      const home = homePathFor(u);
      expect(modulesFor(u).some((m) => m.href === home)).toBe(true);
    }
  });
});

describe("demo users", () => {
  it("has exactly one user per role with unique ids and emails", () => {
    expect(DEMO_USERS.map((u) => u.role).sort()).toEqual(["admin", "employee", "finance", "hr"]);
    expect(new Set(DEMO_USERS.map((u) => u.id)).size).toBe(4);
    expect(new Set(DEMO_USERS.map((u) => u.email)).size).toBe(4);
  });
});
