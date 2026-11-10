import { describe, expect, it } from "vitest";
import { authorize } from "@/lib/auth/authorize";
import type { SessionUser } from "@/lib/auth/roles";

const hr: SessionUser = {
  id: "hr",
  email: "hr@x.test",
  fullName: "HR",
  role: "hr",
  canRequestPayments: false,
  active: true,
};

describe("authorize", () => {
  it("returns 401 when nobody is signed in", () => {
    expect(authorize(null, { module: "hr" })).toMatchObject({ ok: false, status: 401 });
  });

  it("returns 403 for a signed-in user without access", () => {
    expect(authorize(hr, { module: "admin" })).toMatchObject({ ok: false, status: 403 });
    expect(authorize(hr, { module: "finance" })).toMatchObject({ ok: false, status: 403 });
  });

  it("returns ok with the user when allowed", () => {
    expect(authorize(hr, { module: "hr" })).toEqual({ ok: true, user: hr });
  });

  it("supports explicit role lists", () => {
    expect(authorize(hr, { roles: ["admin"] })).toMatchObject({ ok: false, status: 403 });
    expect(authorize(hr, { roles: ["hr", "admin"] })).toMatchObject({ ok: true });
  });

  it("returns 403 for an inactive user even on an allowed module", () => {
    expect(authorize({ ...hr, active: false }, { module: "hr" })).toMatchObject({
      ok: false,
      status: 403,
    });
  });
});
