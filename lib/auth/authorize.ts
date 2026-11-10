import { canAccessModule, type ModuleKey, type Role, type SessionUser } from "./roles";

export type AuthorizeResult =
  { ok: true; user: SessionUser } | { ok: false; status: 401 | 403; error: string };

export type Requirement = { module: ModuleKey } | { roles: readonly Role[] };

/**
 * Pure authorization check used by pages and API routes.
 * 401 when nobody is signed in, 403 when the signed-in user lacks access.
 */
export function authorize(user: SessionUser | null, requirement: Requirement): AuthorizeResult {
  if (!user) return { ok: false, status: 401, error: "Not signed in" };
  if (!user.active) return { ok: false, status: 403, error: "Account is inactive" };

  const allowed =
    "module" in requirement
      ? canAccessModule(user, requirement.module)
      : requirement.roles.includes(user.role);

  if (!allowed) return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, user };
}
