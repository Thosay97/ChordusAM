import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_COOKIE, findDemoUser } from "./demo-users";
import { isRole, type SessionUser } from "./roles";

/**
 * Returns the signed-in user with their role read from `public.profiles`
 * (never from client-editable auth metadata), or null.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (isDemoMode()) {
    const store = await cookies();
    return findDemoUser(store.get(DEMO_COOKIE)?.value);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  // getUser() validates the JWT with Supabase Auth; getSession() would trust the cookie.
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, can_request_payments, active")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!profile || !isRole(profile.role)) return null;

  return {
    id: profile.id as string,
    email: profile.email as string,
    fullName: (profile.full_name as string) || (profile.email as string),
    role: profile.role,
    canRequestPayments: Boolean(profile.can_request_payments),
    active: Boolean(profile.active),
  };
});
