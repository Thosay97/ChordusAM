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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Soft gold and rose glows, after the website's hero. */}
      <span
        aria-hidden="true"
        className="bg-gold/25 pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full blur-[110px]"
      />
      <span
        aria-hidden="true"
        className="bg-rose/20 pointer-events-none absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full blur-[110px]"
      />

      <div className="relative w-full max-w-md">
        <div className="rise mb-8 flex flex-col items-center text-center">
          <Logo size={52} className="text-lg" />
          <h1 className="font-display mt-8 text-5xl leading-[0.92] font-semibold uppercase sm:text-6xl">
            Welcome <em className="gold-text font-medium">back.</em>
          </h1>
          <p className="text-cream/75 mt-3 text-sm">People, studio and money, in one place.</p>
        </div>

        <div
          className="glass rise rounded-[32px] bg-[rgb(58_16_32/0.35)] p-6 sm:p-8"
          style={{ "--d": "0.12s" } as React.CSSProperties}
        >
          {demo ? (
            <div>
              <span className="eyebrow">Demo mode</span>
              <p className="text-cream/75 mt-3 mb-5 text-sm">
                No Supabase project is connected. Pick a demo user to look around.
              </p>
              <ul className="space-y-2.5">
                {DEMO_USERS.map((u) => (
                  <li key={u.id}>
                    <form action={signInAsDemoUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button
                        type="submit"
                        className="group flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3.5 text-left shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] transition duration-300 hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgb(245_166_35/0.45)]"
                      >
                        <span className="font-medium">{u.fullName}</span>
                        <span className="text-gold font-mono text-[0.6rem] tracking-[0.22em] uppercase">
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
              <span className="eyebrow">Sign in</span>
              <div className="mt-5">
                <LoginForms />
              </div>
            </>
          )}
        </div>

        <p className="text-muted mt-8 text-center font-mono text-[0.6rem] tracking-[0.2em] uppercase">
          Alliance Media Company · Colombo
        </p>
      </div>
    </main>
  );
}
