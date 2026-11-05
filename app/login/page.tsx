import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { ROLE_LABELS, homePathFor } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/env";
import { signInAsDemoUser } from "./actions";
import { LoginForms } from "./login-forms";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user?.active) redirect(homePathFor(user));
  const demo = isDemoMode();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Logo className="text-burgundy text-3xl" />
          <p className="text-ink/70 mt-1 text-sm">Alliance Media · people, studio and money</p>
        </div>

        <div className="border-ink/10 rounded-xl border bg-white p-6 shadow-sm">
          {demo ? (
            <div>
              <h1 className="text-lg font-semibold">Demo mode</h1>
              <p className="text-ink/70 mt-1 mb-4 text-sm">
                No Supabase project is connected. Pick a demo user to look around.
              </p>
              <ul className="space-y-2">
                {DEMO_USERS.map((u) => (
                  <li key={u.id}>
                    <form action={signInAsDemoUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button
                        type="submit"
                        className="border-ink/15 hover:border-burgundy hover:bg-tint flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                      >
                        <span>{u.fullName}</span>
                        <span className="bg-tint text-burgundy rounded px-2 py-0.5 text-xs font-semibold">
                          {ROLE_LABELS[u.role]}
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-lg font-semibold">Sign in</h1>
              <LoginForms />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
