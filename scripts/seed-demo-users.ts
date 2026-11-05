/**
 * Creates (or updates) the four Phase 0 demo users in a Supabase project.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DEMO_USER_PASSWORD=... npm run seed:users
 *
 * Uses the service role key, so run it from your machine only. Never in the browser,
 * never in production data. Refuses to run without an explicit DEMO_USER_PASSWORD.
 */
import { createClient } from "@supabase/supabase-js";
import { DEMO_USERS } from "../lib/auth/demo-users";

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!url || !serviceKey) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  if (!password || password.length < 12) {
    throw new Error("Set DEMO_USER_PASSWORD (at least 12 characters).");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listError) throw listError;

  for (const demo of DEMO_USERS) {
    let id = existing.users.find((u) => u.email === demo.email)?.id;

    if (!id) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: demo.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: demo.fullName },
      });
      if (error) throw error;
      id = data.user.id;
      console.log(`created  ${demo.email}`);
    } else {
      const { error } = await supabase.auth.admin.updateUserById(id, { password });
      if (error) throw error;
      console.log(`exists   ${demo.email} (password reset)`);
    }

    // Service role bypasses RLS and the privileged-column guard (auth.uid() is null).
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: demo.fullName,
        role: demo.role,
        can_request_payments: demo.canRequestPayments,
        active: true,
      })
      .eq("id", id);
    if (profileError) throw profileError;
  }

  console.log("Done. Sign in at /login with any demo email and DEMO_USER_PASSWORD.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
