"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DEMO_COOKIE, findDemoUser } from "@/lib/auth/demo-users";
import { homePathFor } from "@/lib/auth/roles";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
  error?: string;
  message?: string;
}

const passwordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

/** Email + password. Used for the seeded demo users; real staff can use magic links. */
export async function signInWithPassword(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter an email and password." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Email or password is wrong." };
  redirect("/");
}

const emailSchema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function sendMagicLink(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    // Only existing staff can sign in. Accounts are created by an Admin.
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/callback` },
  });
  // Same message either way, so the form does not reveal who has an account.
  if (error && error.status !== 400 && error.status !== 422) {
    return { error: "Could not send the link. Try again in a minute." };
  }
  return { message: "If that email belongs to a ChordusAM user, a sign-in link is on its way." };
}

export async function signInAsDemoUser(formData: FormData): Promise<void> {
  if (!isDemoMode()) throw new Error("Demo mode is off");
  const user = findDemoUser(String(formData.get("userId") ?? ""));
  if (!user) throw new Error("Unknown demo user");

  const store = await cookies();
  store.set(DEMO_COOKIE, user.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(homePathFor(user));
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(DEMO_COOKIE);
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
