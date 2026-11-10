import "server-only";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authorize, type Requirement } from "./authorize";
import { getSessionUser } from "./session";
import type { ModuleKey, SessionUser } from "./roles";

/** For server components: send signed-out users to /login, others without access get a 404. */
export async function requireModule(module: ModuleKey): Promise<SessionUser> {
  const result = authorize(await getSessionUser(), { module });
  if (result.ok) return result.user;
  if (result.status === 401) redirect("/login");
  notFound();
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.active) redirect("/login");
  return user;
}

/**
 * For route handlers. Returns the user, or a JSON 401/403 response to return as is:
 *
 *   const auth = await guardApi({ module: "admin" });
 *   if (auth instanceof NextResponse) return auth;
 */
export async function guardApi(requirement: Requirement): Promise<SessionUser | NextResponse> {
  const result = authorize(await getSessionUser(), requirement);
  if (result.ok) return result.user;
  return NextResponse.json({ error: result.error }, { status: result.status });
}
